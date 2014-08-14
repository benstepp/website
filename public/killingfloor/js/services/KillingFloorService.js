(function() {
	angular
		.module('KillingFloorService',['SteamService'])
		.service('KillingFloorService',['$http', '$q', 'SteamService', KillingFloorService]);

	function KillingFloorService($http, $q, SteamService) {
		var _this = this;

		this.players = {};
		this.ajax = false;
		/* this.players is an object indexed by steamid
		players are added here when api is called
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

		//get kf map json file
		this.getMaps = function() {
			var deferred = $q.defer();
	        //if player data exists or is not forced, otherwise make a new request
	        if(typeof _this.kfMaps !== 'undefined') {
	            deferred.resolve(_this.kfMaps);
	        } 
	        else {
	            var url = '/api/steam/1250/kfmaps';
	            $http.get(url)
	            .success(function(response) {
	            	_this.kfMaps = response;
	            	deferred.resolve(_this.kfMaps);
	            })
	            .error(function(response) {
	                deferred.reject(response);
	            });
	        }
	        return deferred.promise;			
		};

		//Called from Routes
		//Parses then makes ajax calls for each player
		this.getPlayers = function(query) {

			var deferred = $q.defer();

			//Immediately reject promise if the query is blank.
			if (query === "") {
				deferred.reject();
			}
			else {
				//Array of promises for each player AJAX call. 
				//this is resolved when all are complete using $q.all()
				var promises = [];

				//Array of comma delimited players as queried from URL
				var players = query.split(',');

				//make AJAX call and push each promise to the array
				angular.forEach(players, function(player) {
					promises.push(getPlayer(player));
				});

				//resolve only when all players are resolved.
				$q.all(promises)
					.then(function(players) {
						deferred.resolve(players);
					});
			}
			
			return deferred.promise;

		};


		var getPlayer = function(query) {

			var deferred = $q.defer();

			var player = createPlayer(query);
			
			//this means either the api has been called or it exists
			if (checkExist(player)) {
				deferred.resolve(_this.players[player.data.summary.steamid]);
			}
			else {
				kfApiCall(player)
					.then(function(player) {
						deferred.resolve(player);
					});
			}
			
			return deferred.promise;
		};

		//creates a player object from userinput. 
		var createPlayer = function(query) {
			var player = {};
			//if the player is a string, parse for customurl or steamid
			if (typeof query === 'string') {
				player.userinput = query;
				player.ajax = false;
				SteamService.parseInput(player);
			}
			//otherwise it's probably an object already
			else {
				player = query;
				player.query = query.data.summary.steamid;
			}
			return player;
		};

		var checkExist = function(player) {
			//if the player has a steamid64 and it is 17 digits long.
			if (player.data && 
				typeof player.data.summary.steamid === 'string' && 
				player.data.summary.steamid.length === 17) {
				//if the player object has this key
				if (this.players.hasOwnProperty(player.data.summary.steamid)) {
					return true;
				}
			}
			//else the player does not exist
			return false;
		};

		var kfApiCall = function(player) {
	        var deferred = $q.defer();
	        //if we have steamid create that object
	      	if (player.data && player.data.summary.steamid) {
            	_this.players[player.data.summary.steamid].ajax = true;
       			}
       		//otherwise just use the generic ajax
       		else {
       			_this.ajax = true;
       		}
			var url = '/api/steam/1250/userstats/' + player.query;
            $http.get(url)
	            .success(function(response) {
	            	//api returns error key if something bad happened
	            	if (!response.error) {
		            	_this.players[response.summary.steamid] = {};
		                _this.players[response.summary.steamid].ajax = false;
		                if (player.data && !player.data.summary.steamid) {
		                	_this.ajax = false;
		                }
		                response.summary = SteamService.fullUrls(response.summary);
		                parseResult(response);
		                deferred.resolve(_this.players[response.summary.steamid]);
	            	}
	            })
	            .error(function(response) {
	                console.log(response);
	                deferred.reject(response);
	            });

	        return deferred.promise;
	    };

	    var parseResult = function(data) {
	    	var steamid = data.summary.steamid;
	    	_this.players[steamid].data = {};
	    	_this.players[steamid].data.summary = data.summary;
	    	_this.players[steamid].data.maps = data.maps;
	    	_this.players[steamid].data.kfstats = data.kfstats;
	    	if (typeof data.kfstats !== 'undefined') {
	    		_this.players[steamid].data.perks = perkRank(data.kfstats);
	   		}
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