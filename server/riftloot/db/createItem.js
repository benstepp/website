var itemKeys = require('../config/itemKeys.js'),
	guessSource = require('./guessSource');

//creates a new Json object for the item removing all irrelevant data.
var createItem = function(data) {

	this._id = data.ItemKey;
	this.name_de = data.Name.German;
	this.name_en = data.Name.English;
	this.name_fr = data.Name.French;
	this.rarity = data.Rarity;
	this.value = data.Value;
	this.icon = data.Icon;
	this.onEquip = data.OnEquip;
	this.drop = {};

	//some items in xml do not have a BoA flag, so we will default to it if the BoE/BoP flag isn't there
	//the flag that _should_ be there is data.AccountBound which is an xml node with no text.
	this.bind = data.SoulboundTrigger || 'Bound to Account';
	
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

	renameKeys(this);
	guessSource(this);
	
};


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

function defined(data) {
	return (typeof data !== 'undefined');
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

	if(defined(itemm.bind)) {
		itemm.bind = itemKeys[itemm.bind] || itemm.bind;
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

module.exports = createItem;