var q = require('q'),
	_ = require('lodash'),
	riftloot = require('./models/item.js'),
	itemSlots = require('./config/itemSlots.js');

var dropsByRole = function(calling,role,locale) {

	var _this = this;

	var allDeferred = q.defer();

	var getDrops = function() {
		var promises = [];

		_.forEach(itemSlots,function(val){
			var promise = dbQuery(val);
			promises.push(promise);
		});

		q.all(promises).then(function(){
			allDeferred.resolve(_this);
		});
	};

	var dbQuery = function(slot) {
		var deferred = q.defer();

		riftloot.find();

		return deferred.promise;
	};


	getDrops();
	return allDeferred.promise;
};

module.exports = dropsByRole;