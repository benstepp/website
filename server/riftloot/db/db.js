var fs = require('fs'),
	q = require('q'),
	_ = require('lodash'),
	mongoose = require('mongoose'),
	xmlstream = require('xml-stream'),
	item = require('../models/item.js'),
	createItem = require('./createItem.js'),
	dropLocations = require('./dropLocations.js'),
	upgradePaths = require('./upgradePaths.js');

//connect to database
mongoose.connect('mongodb://localhost/');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('connected to database');

	getBulkXML()
		.then(function(data) {
			console.log('finished adding ' + data.length + ' items to database');
			saveDropLocations();
		});

});


function getBulkXML(sortFunction) {
		var deferred = q.defer();

		//this is the items.xml from ftp://ftp.trionworlds.com/rift/data/
		//only works if you call this file from base directory
		var fileLocation = './dev/Items.xml';

		var stream = fs.createReadStream(fileLocation);
		var xml = new xmlstream(stream);
		var results = [];

		xml.on('endElement: Item', function(data) {
				if (sort(data)) {
					//xml.pause();
					var parsedItem = new createItem(data);
					saveItem(parsedItem).then(function(err) {
						//xml.resume();
					});

					results.push(parsedItem);
					console.log('items parsed: ' + results.length);
				}

			});

		xml.on('end', function() {
			if(process.env.NODE_ENV == 'development') {
				fs.writeFile('./dev/items.json', JSON.stringify({items:results}), function(err){
					if (err) {console.log(err);}
					else {console.log('json of parsed items.xml saved');}
				});
			}
			deferred.resolve(results);
		});


		return deferred.promise;
}

//Determines whether or not the item is an expert or higher item for the Nightmare Tide expansion
function sort(data) {
	var keepItem = false;

	//why are level 65 greaters actually required level 60?
	//trino pls
	if (	data.RiftGem && 
				parseInt(data.RequiredLevel) === 60 &&
				data.OnEquip ) {
		if (data.OnEquip.ResistanceAll > 100 || 
			data.OnEquip.ResistanceLife > 100 ||
			data.OnEquip.ResistanceDeath > 100 ||
			data.OnEquip.ResistanceEarth > 100 ||
			data.OnEquip.ResistanceFire > 100 ||
			data.OnEquip.ResistanceWater > 100 ||
			data.OnEquip.ResistanceAir > 100) {
			keepItem = true;
		}
	}

	else if (	parseInt(data.RequiredLevel) !== 65 ||
			data.Rarity === "Common" || 
			data.Rarity === "Uncommon") {
		keepItem = false;
	}

	else {
		keepItem = true;
	}

	return keepItem;

}

//save the item to the database
function saveItem(itemm) {
	var deferred = q.defer();
	var newItem = new item(itemm);

	//Can't figure out how to use the newItem, so delete old one and shove new one in it's place
	item.findByIdAndRemove(newItem._id,
		function(err,doc) {
		if (err) {
			console.log(err);
			deferred.reject();
		}
		else{
			newItem.save(function(err) {
				if (err) {
					console.log(err);
					deferred.reject();
				}
				else {
					deferred.resolve();				
				}
			});
		}
	});

	return deferred.promise;
}

function saveDropLocations() {
	var promises = [];

	for (var tier in dropLocations) {
		for (var instance in dropLocations[tier]) {
			for (var boss in dropLocations[tier][instance]) {
				var bossLength = dropLocations[tier][instance][boss].length;
				for (var i = 0;i < bossLength; i++) {
					var dropPromise = saveItemDrop(dropLocations[tier][instance][boss][i], boss, instance, tier);
					promises.push(dropPromise);
				}
			}
		}
	}

	q.all(promises).then(function(){
		console.log('drop info saved');
	});

}

function saveItemDrop(itemId, bossC, instanceC, tierC) {
	var deferred = q.defer();

	item.findByIdAndUpdate(itemId, 
		{drop:{
			tier:tierC,
			instance:instanceC,
			boss:bossC
		}},
		function(err,result) {
			if (err) { console.log(err); }
			else { deferred.resolve(); }
		});

	return deferred.promise;
}