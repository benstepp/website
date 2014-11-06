var fs = require('fs'),
	q = require('q'),
	_ = require('lodash'),
	mongoose = require('mongoose'),
	xmlstream = require('xml-stream'),
	item = require('./models/item.js'),
	itemKeys = require('./config/itemKeys.js'),
	statOrder = require('./config/itemStatOrder.js'),
	dropLocations = require('./config/dropLocations.js');

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
		var stream = fs.createReadStream('./dev/items.xml');
		var xml = new xmlstream(stream);
		var results = [];

		xml.on('endElement: Item', function(data) {
				if (sort(data)) {
					//xml.pause();
					var parsedItem = new createItem(data);
					parsedItem = renameKeys(parsedItem);
					saveItem(parsedItem).then(function(err) {
						//xml.resume();
					});

					results.push(parsedItem);
					console.log('items parsed: ' + results.length);
				}

			});

		xml.on('end', function() {
			fs.writeFile('./dev/items.json', JSON.stringify({items:results}), function(err){
				if (err) {console.log(err);}
				else {console.log('json of parsed items.xml saved');}
			});
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
		this.armor = data.Armor; 
	}
	if (defined(data.ArmorType)) {
		this.armorType = data.ArmorType;
	}
	if (defined(data.WeaponType)) {
		this.weaponType = data.WeaponType;
	}

	this.calling = getCalling(data);
	this.role = getRole(data);

	//rename the ability object
	if (typeof this.onEquip === 'object' && typeof this.onEquip.Ability === 'object') {
		this.onEquip.ability_de = this.onEquip.Ability.German;
		this.onEquip.ability_en = this.onEquip.Ability.English;
		this.onEquip.ability_fr = this.onEquip.Ability.French;
		delete this.onEquip.Ability;
	}

	//include itemset info
	if(defined(data.ItemSet)) {
		this.itemset_de = data.ItemSet.FamilyName.German;
		this.itemset_en = data.ItemSet.FamilyName.English;
		this.itemset_fr = data.ItemSet.FamilyName.French;
	}
	
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
	var deferred = q.defer();
	var newItem = new item(itemm).toObject();

	item.update({_id:newItem._id},newItem,{upsert:true},function(err) {
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

function renameKeys(itemm) {
	//renames the stat names in the onEquip object
	if(defined(itemm.onEquip)) {
		var newEquip = {};
		for (var k in itemm.onEquip){
			if (typeof itemKeys[k] !== 'undefined') {
				newEquip[itemKeys[k]] = itemm.onEquip[k];
			}
			else {
				newEquip[k] = itemm.onEquip[k];
			}
		}
		delete itemm.onEquip[k];
		itemm.onEquip = newEquip;
	}

	//renames the weapon type
	if(defined(itemm.weaponType)) {
		if(typeof itemKeys[itemm.weaponType] !== 'undefined') {
			itemm.weaponType = itemKeys[itemm.weaponType];
		}
	}

	//renames the itemslot
	if(defined(itemm.slot)) {
		if(typeof itemKeys[itemm.slot] !== 'undefined') {
			itemm.slot = itemKeys[itemm.slot];
		}
	}

	return itemm;
	
}