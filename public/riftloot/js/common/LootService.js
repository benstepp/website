(function() {
	angular
		.module('LootService',[])
		.service('LootService',['$http', '$q', LootService]);

	function LootService($http, $q) {
		var _this = this;

		_this.itemsByLocation = {
			de: {},
			en: {},
			fr: {}
		};

		_this.itemsByRole = {
			cleric:{
				dps:{de:{},en:{},fr:{}},
				tank:{de:{},en:{},fr:{}}
			},
			mage:{
				dps:{de:{},en:{},fr:{}},
				tank:{de:{},en:{},fr:{}}
			},
			rogue:{
				dps:{de:{},en:{},fr:{}},
				tank:{de:{},en:{},fr:{}}
			},
			warrior:{
				dps:{de:{},en:{},fr:{}},
				tank:{de:{},en:{},fr:{}}
			}
		};

		_this.getItemsByLocation = function(tier,locale) {
			var deferred = $q.defer();

			if (_this.itemsByLocation[locale][tier]) {
				deferred.resolve(_this.itemsByLocation[locale][tier]);
			}
			else {
				lootApiCall(tier,locale).then(function(data) {
					_this.itemsByLocation[locale][tier] = data;
					deferred.resolve(data);
				});
			}

			return deferred.promise;
		};

		var lootApiCall = function(tier,locale) {
	        var deferred = $q.defer();
	        
			var url = '/api/riftloot/location/' + tier + '/' + locale + '/';
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

	    _this.getItemsByRole = function(calling,role,locale) {
	    	var deferred = $q.defer();

	    	if(Object.keys(_this.itemsByRole[calling][role][locale]).length > 0) {
	    		deferred.resolve(_this.itemsByRole[calling][role][locale]);
	    	}
	    	else {
	    		roleApiCall(calling,role,locale).then(function(data) {
	    			_this.itemsByRole[calling][role][locale] = data;
	    			deferred.resolve(data);
	    		});
	    	}

	    	return deferred.promise;
	    };

	    var roleApiCall = function(calling,role,locale) {
	    	var deferred = $q.defer();

	    	var url = '/api/riftloot/role/'+calling+'/'+role+'/'+locale+'/';
	    	$http.get(url)
	    		.success(function(response) {
	    			var items = orderRole(response);
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
	    				angular.forEach(newLoot[tier][instance][boss].loot, function(val,key) {
	    					val.drop = {};
	    					val.drop.boss = boss;
	    					val.drop.instance = instance;
	    					val.drop.tier = tier;
	    				});
	    			}
	    		}
	    	}
	    	for(var t in newLoot) {
	    		for(var ins in newLoot[t]) {
	    			for (var bos in newLoot[t][ins]) {
	    				var lootArray = angular.forEach(newLoot[t][ins][bos].loot, function(value){
	    					orderStats(value);
	    				});
	    			}
	    		}
	    	}

	    	return newLoot;
	    };

	    var orderRole = function(items) {
	    	var newItems = {};
	    	for (var slot in items) {
	    		newItems[slot] = [];
	    		angular.forEach(items[slot], function(val) {
	    			newItems[slot].push(orderStats(val));
	    		});
	    	}
	    	return newItems;
	    };

	    var orderStats = function(item) {
	    	var statOrder = {
	    		main: {
	    			mage:["Intelligence","Wisdom"],
	    			cleric:["Wisdom","Intelligence"],
	    			rogue:["Dexterity","Strength"],
	    			warrior:["Strength","Dexterity"]
	    		},
	    		rest: ["Endurance",
	    		"Block","Guard","Dodge",
	    		"Attack Power","Spell Power","Crit Power","Physical Crit","Spell Critical Hit",
	    		"Resist All"
	    		]
	    	};
			//console.log(item);
			if(typeof item.onEquip !== 'undefined') {
				var newEquip = {};
				//just use first calling
				var calling = item.calling[0];
				var iterator = 0;

				//main stats
				for(var key in statOrder.main[calling]) {
					if(typeof item.onEquip[statOrder.main[calling][key]] !== 'undefined') {
						newEquip[statOrder.main[calling][key]] = {};
						newEquip[statOrder.main[calling][key]].value = item.onEquip[statOrder.main[calling][key]];
						newEquip[statOrder.main[calling][key]].order = iterator;
						iterator++;
						delete item.onEquip[statOrder.main[calling][key]];
					}
				}
				//other stats
				for(var k in statOrder.rest) {
					if(typeof item.onEquip[statOrder.rest[k]] !== 'undefined') {
						newEquip[statOrder.rest[k]] = {};
						newEquip[statOrder.rest[k]].value = item.onEquip[statOrder.rest[k]];
						newEquip[statOrder.rest[k]].order = iterator;
						iterator++;
						delete item.onEquip[statOrder.rest[k]];
					}
				}
				//hit
				if(typeof item.onEquip.Hit !== 'undefined') {
					newEquip.Hit = {};
					newEquip.Hit.value = item.onEquip.Hit;
					newEquip.Hit.order = iterator;
					iterator++;
					delete item.onEquip.Hit;
				}
				//everything that may be left(like ability) 
				for (var ke in item.onEquip) {
					newEquip[ke] = {};
					newEquip[ke].value = item.onEquip[ke];
					newEquip[ke].order = iterator;
					iterator++;
					delete item.onEquip[ke];
				}

				item.onEquip = newEquip;
				
			}
			return item;

	    };

	}


})();