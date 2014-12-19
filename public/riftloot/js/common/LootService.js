(function() {
	'use-strict';

	angular
		.module('LootService',[])
		.service('LootService',['$http', '$q', LootService]);

	function LootService($http, $q) {
		var _this = this;
		_this.itemsByLocation = {};
		_this.itemsByRole = {};
		_this.getItemsByLocation = getItemsByLocation;
		_this.getItemsByRole = getItemsByRole;

		activate();

		function activate() {

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
		}

		function getItemsByLocation(tier,locale) {
			var items = _this.itemsByLocation[locale][tier];
			var apiCallNeeded = (typeof items === 'undefined');

			//returns either the items from the service or a promise from the ApiCall
			return $q.when(apiCallNeeded ? lootApiCall(tier,locale) : items);

		}

		function lootApiCall(tier,locale) {
			var url = '/api/riftloot/location/' + tier + '/' + locale + '/';

            return $http.get(url)
            	.then(function(res) {
            		var items = orderLoot(res.data);
            		_this.itemsByLocation[locale] = items;
            		return items;
            	});

	    }

	    function getItemsByRole(calling,role,locale) {
	    	var items = _this.itemsByRole[calling][role][locale];
	    	var apiCallNeeded = Object.keys(items).length === 0;

	    	//returns either the items from the service or a promise from the apiCall
	    	return $q.when(apiCallNeeded ? rollApiCall(calling,role,locale) : items);

	    }

	    function rollApiCall(calling,role,locale) {
	    	var url = '/api/riftloot/role/'+calling+'/'+role+'/'+locale+'/';

	    	return $http.get(url).then(function(res) {
	    		var items = orderRole(res.data);
	    		_this.itemsByRole[calling][role][locale] = items;
	    		return items;
	    	});
	    }

	    function orderLoot(loot) {
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
	    }

	    function orderRole(items) {
	    	var newItems = {};
	    	for (var slot in items) {
	    		newItems[slot] = [];
	    		angular.forEach(items[slot], function(val) {
	    			newItems[slot].push(orderStats(val));
	    		});
	    	}
	    	return newItems;
	    }

	    function orderStats(item) {
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

	    }

	}


})();