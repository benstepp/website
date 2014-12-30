var fs = require('fs'),
	q = require('q'),
	_ = require('lodash'),
	mongoose = require('mongoose'),
	xmlstream = require('xml-stream'),
	item = require('../models/item.js'),
	itemKeys = require('../config/itemKeys.js'),
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
					parsedItem = renameKeys(parsedItem);
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

	if(defined(data.SoulBoundTrigger)) {
		this.bind = data.SoulBoundTrigger;
	}

	if(defined(data.SpellDamage)) {
		var currentSpellDamage = parseInt(this.onEquip.SpellPower) || 0;
		this.onEquip.SpellPower = parseInt(data.SpellDamage) + currentSpellDamage;
	}

	if (defined(data.Slot) || defined(data.RiftGem)) {
		this.slot = data.Slot || (data.RiftGem + ' Essence');
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

	if (typeof data.OnUse !== 'undefined' && typeof data.OnUse.Ability !== 'undefined') {
		this.onEquip.onUse_de = data.OnUse.Ability.German;
		this.onEquip.onUse_en = data.OnUse.Ability.English;
		this.onEquip.onUse_fr = data.OnUse.Ability.French;
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
		return ["cleric", "mage", "rogue", "warrior"];
	}

	if(defined(data.ArmorType)) {
		switch(data.ArmorType) {
			case "Plate":
				return ["warrior"];
			case "Leather":
				return["rogue"];
			case "Chain":
				return["cleric"];
			case "Cloth":
				if (data.Slot !== 'Cape'){
					return ["mage"];
				}
				break;
			
			default:break;
		}
	}

	//int/wis items
	if (defined(data.OnEquip.Intelligence) || defined(data.OnEquip.Wisdom)) {
		var intelligence = parseInt(data.OnEquip.Intelligence) || 0,
			wisdom = parseInt(data.OnEquip.Wisdom) || 0;

		if(intelligence === wisdom) {
			return ["cleric", "mage"];
		}
		if(intelligence > wisdom) {
			return ["mage"];
		}
		if(wisdom > intelligence) {
			return ["cleric"];
		}

	}

	//str and dex items
	if (defined(data.OnEquip.Strength) || defined(data.OnEquip.Dexterity)) {
		var strength = parseInt(data.OnEquip.Strength) || 0,
			dexterity = parseInt(data.OnEquip.Dexterity) || 0;

		if(strength === dexterity) {
			return ["rogue", "warrior"];
		}
		if(strength > dexterity) {
			return ["warrior"];
		}
		if(dexterity > strength) {
			return ["rogue"];
		}

	}

	//pure endurance items (like seals)
	if (defined(data.OnEquip.Endurance)) {
		return ["cleric", "mage", "rogue", "warrior"];
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
		return "tank";
	}

	//if it has a main stat it's probably a dps item
	if(defined(data.OnEquip.Dexterity) || defined(data.OnEquip.Intelligence) || defined(data.OnEquip.Strength) || defined(data.OnEquip.Wisdom)) {
		return "dps";
	}

	//otherwise it's probably endurance only and tank item
	else {
		return "tank";
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

	//adds the number of items in an itemset to the itemset key
	if(defined(itemm.itemset_en)) {
		var setCount = itemKeys[itemm.itemset_en];
		itemm.itemset_de += setCount;
		itemm.itemset_en += setCount;
		itemm.itemset_fr += setCount;

	}

	return itemm;
	
}