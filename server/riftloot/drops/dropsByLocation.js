var q = require('q'),
	_ = require('lodash'),
	riftloot = require('../models/item.js'),
	localeCheck = require('./localeCheck.js');

var dropsByLocation = function(jsonDrops,locale) {

	var _this = {};

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
				newItem = _.omit(newItem,'drop');
				_this[tier][instance][boss].push(newItem);
				deferred.resolve();
			}
		});

		return deferred.promise;
	};


	getDrops();
	return allDeferred.promise;

};

module.exports = dropsByLocation;