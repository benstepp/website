var q = require('q'),
	_ = require('lodash'),
	riftloot = require('./models/item.js');

var dropsByLocation = function(jsonDrops,locale,callback) {

	var _this = this;

	var allDeferred = q.defer();

	var getDrops = function() {
		var promises = [];

		for (var tier in jsonDrops) {
			_this[tier] = {};
			for (var instance in jsonDrops[tier]) {
				_this[tier][instance] = {};
				for (var boss in jsonDrops[tier][instance]) {
					_this[tier][instance][boss] = [];
					var bossLength = jsonDrops[tier][instance][boss].length;
					for (var j =0; j < bossLength;j++) {
						var promise = getItemInfo(jsonDrops[tier][instance][boss][j],locale,tier,instance,boss);
						promises.push(promise);
					}
				}
			}
		}

		q.all(promises).then(function(){
			allDeferred.resolve(_this);
		});

	};



	var getItemInfo = function(id,locale,tier,instance,boss) {
		var deferred = q.defer();

		riftloot.findById(id, function(err, result) {
			if (err) {console.log(err);}
			else{
				var newItem = localeCheck(result.toObject(),locale);
				_this[tier][instance][boss].push(newItem);
				deferred.resolve();
			}
		});

		return deferred.promise;
	};

	//removes language keys
	var localeCheck = function(item,locale) {
		var newItem = _.omit(item,['__v','drop']);
		if(locale === 'de') {
			newItem = _.omit(newItem,['name_en','name_fr','itemset_en','itemset_fr']);
			if (!_.isUndefined(newItem.onEquip) && !_.isUndefined(newItem.onEquip.ability_de)) {
				newItem.onEquip = _.omit(newItem.onEquip,['ability_en','ability_fr']);
			}
		}
		if(locale === 'en') {
			newItem = _.omit(newItem,['name_de','name_fr','itemset_de','itemset_fr']);
			if (!_.isUndefined(newItem.onEquip) && !_.isUndefined(newItem.onEquip.ability_en)) {
				newItem.onEquip = _.omit(newItem.onEquip,['ability_de','ability_fr']);
			}
		}
		if(locale === 'fr') {
			newItem = _.omit(newItem,['name_de','name_en','itemset_de','itemset_de']);
			if (!_.isUndefined(newItem.onEquip) && !_.isUndefined(newItem.onEquip.ability_fr)) {
				newItem.onEquip = _.omit(newItem.onEquip,['ability_de','ability_en']);
			}
		}
		return newItem;
	};

	getDrops();
	return allDeferred.promise;

};

module.exports = dropsByLocation;