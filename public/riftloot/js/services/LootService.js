(function() {
	angular
		.module('LootService',[])
		.service('LootService',['$http', '$q', LootService]);

	function LootService($http, $q) {
		var _this = this;
		_this.loot = {
			de: {},
			en: {},
			fr: {}
		};

		_this.getLoot = function(tier,locale) {
			var deferred = $q.defer();
			if (_this.loot[locale][tier]) {
				deferred.resolve(_this.loot[locale][tier]);
			}
			else {
				_this.lootApiCall(tier,locale).then(function(data) {
					_this.loot[locale][tier] = data;
					deferred.resolve(data);
				});
			}

			return deferred.promise;
		};

		_this.lootApiCall = function(tier,locale) {
	        var deferred = $q.defer();
	        
			var url = '/api/riftloot/' + tier + '/' + locale + '/';
            $http.get(url)
	            .success(function(response) {
	            	var items = orderLoot(response);
	            	deferred.resolve(items);
	            })
	            .error(function(response) {
	                deferred.reject();
	            });

	        return deferred.promise;
	    };

	    var orderLoot = function(loot) {
	    	var newLoot = {};
	    	var i = 0;
	    	for (var tier in loot) {
	    		newLoot[tier] = {};
	    		for (var instance in loot[tier]) {
	    			newLoot[tier][instance] = {};
	    			for (var boss in loot[tier][instance]) {
	    				newLoot[tier][instance][boss] = {};
	    				newLoot[tier][instance][boss].loot = loot[tier][instance][boss];
	    				newLoot[tier][instance][boss].order = i;
	    				i++; 
	    			}
	    		}
	    	}
	    	return newLoot;
	    };

	}


})();