var fs = require('fs'),
	q = require('q'),
	mongoose = require('mongoose'),
	xmlstream = require('xml-stream'),
	item = require('../server/riftloot/models/item.js');

//connect to database
mongoose.connect('mongodb://localhost/');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('connected to database');

	getBulkXML()
		.then(function(data) {
			console.log('finished adding' + data.length + 'items to database');
		});

});


function getBulkXML(sortFunction) {
		var deferred = q.defer();
		var stream = fs.createReadStream('../dev/items.xml');
		var xml = new xmlstream(stream);
		var results = [];

		xml.on('endElement: Item', function(data) {
				if (sort(data)) {
					xml.pause();
					var parsedItem = new createItem(data);
					saveItem(parsedItem).then(function(err) {
						xml.resume();
					});

					results.push(parsedItem);
					console.log('items parsed: ' + results.length);
				}

			});

		xml.on('end', function() {
			deferred.resolve(results);
		});

		return deferred.promise;
}

//Determines whether or not the item is an expert or higher item for the Nightmare Tide expansion
function sort(data) {

	if (	parseInt(data.RequiredLevel) !== 65 ||
			data.Rarity === "Common" || 
			data.Rarity === "Uncommon" ||
			data.SoulboundTrigger !== "BindOnPickup" ) {
		return false;
	}

	else {
		return true;
	}

}

//creates a new Json object for the item removing all irrelevant data.
function createItem(data) {

	this._id = data.ItemKey;
	this.name_de = data.Name.German;
	this.name_en = data.Name.English;
	this.name_fr = data.Name.French;
	this.rarity = data.Rarity;
	this.value = data.Value;
	this.icon = data.Icon;
	this.onEquip = data.OnEquip;

	if (defined(data.Slot)) {
		this.slot = data.Slot;
	}
	if (defined(data.Armor)) {
		this.Armor = data.Armor; 
	}
	if (defined(data.ArmorType)) {
		this.ArmorType = data.ArmorType;
	}

	this.calling = getCalling(data);
	this.role = getRole(data);
	
}

function defined(data) {
	if (typeof data === 'undefined') {
		return false;
	}
	else {
		return true;
	}
}

function getCalling(data) {

	//if no stats
	if (!defined(data.OnEquip)) {
		return ["Cleric", "Mage", "Rogue", "Warrior"];
	}

	//int/wis items
	if (defined(data.OnEquip.Intelligence) || defined(data.OnEquip.Wisdom)) {
		var intelligence = parseInt(data.OnEquip.Intelligence),
			wisdom = parseInt(data.OnEquip.Wisdom);

		if(intelligence === wisdom) {
			return ["Cleric", "Mage"];
		}
		if(intelligence > wisdom) {
			return ["Mage"];
		}
		if(wisdom > intelligence) {
			return ["Cleric"];
		}

	}

	//str and dex items
	if (defined(data.OnEquip.Strength) || defined(data.OnEquip.Dexterity)) {
		var strength = parseInt(data.OnEquip.Strength),
			dexterity = parseInt(data.OnEquip.Dexterity);

		if(strength === dexterity) {
			return ["Rogue", "Warrior"];
		}
		if(strength > dexterity) {
			return ["Warrior"];
		}
		if(dexterity > strength) {
			return ["Rogue"];
		}

	}

	//pure endurance items (like seals)
	if (defined(data.OnEquip.Endurance)) {
		return ["Cleric", "Mage", "Rogue", "Warrior"];
	}

	//idk
	else {
		return [];
	}

}

function getRole(data) {
	//if no stats on the item return blank
	if (!defined(data.OnEquip)) {
		return "";
	}

	//tank shit
	if (defined(data.OnEquip.Guard) || defined(data.OnEquip.ShieldBlock) || defined(data.OnEquip.Dodge)) {
		return "Tank";
	}
	else {
		return "DPS";
	}
}

function saveItem(itemm) {
	var deferred = q.defer();d
	var newItem = new item(itemm);

	newItem.save(function(err) {
		if (err) {
			console.log(err);
			deferred.reject();
		}
		else{
			deferred.resolve();
		}
	});

	return deferred.promise;
}


