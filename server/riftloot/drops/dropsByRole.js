var q = require('q'),
	_ = require('lodash'),
	riftloot = require('../models/item.js'),
	itemSlots = require('../config/itemSlots.js');

var dropsByRole = function(calling,role,locale) {

	var _this = {};

	var allDeferred = q.defer();

	var getDrops = function() {
		var promises = [];

		_.forEach(itemSlots,function(val){
			var promise = dbQuery(val);
			promises.push(promise);
		});

		q.all(promises).then(function(){
			console.log('qall');
			allDeferred.resolve(_this);
		});
	};

	var dbQuery = function(slot) {
		var deferred = q.defer();

		riftloot.find({calling:calling})
			.where('role').equals(role)
			.where('slot').equals(slot)
			.exec(function(err,res) {
					_this[slot] = res;
					deferred.resolve();
			});

		return deferred.promise;
	};


	getDrops();
	return allDeferred.promise;
};

module.exports = dropsByRole;