var _ = require('lodash');

//item an item model after Model.toObject()
//locale from the route (de/en/fr)
var localeCheck = function(item,locale) {

		//remove the mongoose versionKey
		var newItem = _.omit(item,['__v']);

		if(locale === 'de') {
			newItem = _.omit(newItem,['name_en','name_fr','itemset_en','itemset_fr']);
			if (!_.isUndefined(newItem.onEquip) && !_.isUndefined(newItem.onEquip.ability_de)) {
				newItem.onEquip = _.omit(newItem.onEquip,['ability_en','ability_fr']);
			}
			if (!_.isUndefined(newItem.onEquip) && !_.isUndefined(newItem.onEquip.onUse_de)) {
				newItem.onEquip = _.omit(newItem.onEquip,['onUse_en','onUse_fr']);
			}
		}

		if(locale === 'en') {
			newItem = _.omit(newItem,['name_de','name_fr','itemset_de','itemset_fr']);
			if (!_.isUndefined(newItem.onEquip) && !_.isUndefined(newItem.onEquip.ability_en)) {
				newItem.onEquip = _.omit(newItem.onEquip,['ability_de','ability_fr']);
			}
			if (!_.isUndefined(newItem.onEquip) && !_.isUndefined(newItem.onEquip.onUse_en)) {
				newItem.onEquip = _.omit(newItem.onEquip,['onUse_de','onUse_fr']);
			}
		}
		
		if(locale === 'fr') {
			newItem = _.omit(newItem,['name_de','name_en','itemset_de','itemset_de']);
			if (!_.isUndefined(newItem.onEquip) && !_.isUndefined(newItem.onEquip.ability_fr)) {
				newItem.onEquip = _.omit(newItem.onEquip,['ability_de','ability_en']);
			}
			if (!_.isUndefined(newItem.onEquip) && !_.isUndefined(newItem.onEquip.onUse_fr)) {
				newItem.onEquip = _.omit(newItem.onEquip,['onUse_de','onUse_en']);
			}
		}
		return newItem;
	};

module.exports = localeCheck;