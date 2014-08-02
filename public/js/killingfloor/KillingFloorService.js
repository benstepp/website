(function() {
	angular
		.module('KillingFloorService',['SteamService'])
		.service('KillingFloorService',['$http', '$q', 'SteamService', KillingFloorService]);

	function KillingFloorService($http, $q, SteamService) {
		var _this = this;

		this.players = [];
		/* this.players is an array of objects
		{	
			userinput: userinput, direct input from the user
			query: parsed query of userinput in case of url
			ajax: bool, whether or not there is open ajax for this query
			id64: steamid64
			data: {
				summary: summary object
				kfstats: kfstats array
				maps: mapach array
			}
		}
		*/

		var observerCallbacks = [];
		this.registerObserverCallback = function(callback) {
			observerCallbacks.push(callback);
		};

		var notifyObservers = function() {
			angular.forEach(observerCallbacks, function(callback) {
				callback();
			});
		};

		//get kf map json file
		this.getMaps = function() {
			var deferred = $q.defer();
	        //if player data exists or is not forced, otherwise make a new request
	        if(typeof _this.kfMaps !== 'undefined') {
	            deferred.resolve(_this.kfMaps);
	        } 
	        else {
	            var url = 'api/steam/1250/kfmaps';
	            $http.get(url)
	            .success(function(response) {
	            	_this.kfMaps = response;
	            	deferred.resolve(response);
	            })
	            .error(function(response) {
	                console.log(response);
	                deferred.reject(response);
	            });
	        }
	        return deferred.promise;			
		};

		var checkExist = function(query) {
			var playerLength = _this.players.length;
			for (var i = 0; i< playerLength; i++) {
				var player = _this.players[i];
				if (player.query === query || player.userinput === query) {
					var returnobj = {
						"player":player,
						"index":i
					};
					return returnobj;
				}
			}
			//if the player was not found
			return false;
		};

		this.removePlayer = function(steamid) {
			var playerLength = _this.players.length;
			for (var i = 0; i < playerLength; i ++) {
				if (_this.players[i].data.summary.steamid === steamid) {
					_this.players.splice(i,1);
					break;
				}
			}
		};

		this.getPlayerByObj = function(player) {
			player.query = player.data.summary.steamid;
			var index = _this.players.length;
			_this.players.push(player);
			notifyObservers();
			kfApiCall(index, player, true)
				.then(function(){
					notifyObservers();
				});
		};

		this.getPlayer = function(userinput, force) {
			var exist = checkExist(userinput);
			//create it if it doesn't exist
			if (!exist) {
				var player = {
					"userinput":userinput,
					"ajax":false
				};
				//parse the userinput, returns object with query
				SteamService.parseInput(player);
				var index = _this.players.length;
				//i think this will work
				_this.players.push(player);
				//make call because it is new
				kfApiCall(index, player, true)
					.then(function(){
						notifyObservers();
					});
			}
			//no current ajax call and forced
			else if(!exist.player.ajax && force) {
				//this force is always true
				kfApiCall(exist.index, exist.player, force)
					.then(function(){
						notifyObservers();
					});
			}

		};

		var kfApiCall = function(index, player, force, friends) {
	        var deferred = $q.defer();
	        //if player data exists or is not forced, otherwise make a new request
	        if(typeof player.data !== undefined && !force) {
	            deferred.resolve(player.data);
	        } 
	        else {
	            _this.players[index].ajax = true;
				var url = 'api/steam/1250/userstats/' + player.query;
	            $http.get(url)
	            .success(function(response) {
	                _this.players[index].ajax = false;
	                response.summary = SteamService.fullUrls(response.summary);
	                parseResult(index, response);
	                deferred.resolve(_this.players[index]);
	            })
	            .error(function(response) {
	                console.log(response);
	                deferred.reject(response);
	            });
	        }
	        return deferred.promise;
	    };

	    var parseResult = function(index, data) {
	    	_this.players[index].data = {};
	    	_this.players[index].data.summary = data.summary;
	    	_this.players[index].data.kfstats = data.kfstats;
	    	if (typeof data.kfstats !== 'undefined') {
	    		_this.players[index].data.perks = perkRank(data.kfstats);
	   		}
	    	_this.players[index].data.maps = data.maps;
	    };

	    var perkRank = function(kfstats) {
	    	var perks = {
		    	fieldmedic: {
		    		'DamageHealed':[200,750,4000,12000,25000,100000]
		    	},
		    	support:{
		    		'ShotgunDamage': [25000,100000,500000,1500000,3500000,5500000],
		    		'WeldingPoints': [2000,7000,35000,120000,250000,370000]
		    	},
		    	sharpshooter: {
					'HeadshotKills':[30,100,700,2500,5500,8500]
		    	},
		    	commando:{
		    		'BullpupDamage': [25000,100000,500000,1500000,3500000,5500000],
		    		'StalkerKills': [30,100,350,1200,2400,3600]
		    	},
		    	berserker:{
		    		'MeleeDamage':[25000,100000,500000,1500000,3500000,5500000]
		    	},
		    	firebug:{
		    		'FlameThrowerDamage':[25000,100000,500000,1500000,3500000,5500000]
		    	},
		    	demolitions: {
		    		'ExplosivesDamage':[25000,100000,500000,1500000,3500000,5500000]
		    	}
		    };
	    	var playerPerks = {};
	    	//for each of the 7 perks
	    	for (var perk in perks) {
	    		//initialize the playerPerks object with excessive numbers
	    		playerPerks[perk] = 6;

	    		//for each key to seach for in the stats array
	    		for (var key in perks[perk]) {
	    			//check if the player has this key, otherwise break
	    			if (!kfstats.hasOwnProperty(key)) {
	    				playerPerks[perk] = 0;
	    				break;
	    			}
	    			//for each of the 6 ranks in each key
	    			for (var i = 0; i < 6; i++) {
	    				//because we are itterating from first key, we can assume if
	    				//it is less than the key that is the rank of perk
	    				//also checks if this key is lower than the current one saved.
	    				if (kfstats[key] < perks[perk][key][i] && i < playerPerks[perk]) {
	    						playerPerks[perk] = i;
	    						break;
	    				}
	    				//else the key we have is good
	    			}

	    		}
	    	}
	    	return playerPerks;

	    };

	}

})();