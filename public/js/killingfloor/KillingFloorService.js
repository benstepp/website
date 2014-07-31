(function() {
	angular
		.module('KillingFloorService',[])
		.service('KillingFloorService',['$http', '$q', KillingFloorService]);

	function KillingFloorService($http, $q) {
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

		this.getPlayer = function(userinput, friends, force) {
			var exist = checkExist(userinput);
			//create it if it doesn't exist
			if (!exist) {
				var player = {
					"userinput":userinput,
					"ajax":false
				};
				//parse the userinput, returns object with query
				parseInput(player);
				var index = _this.players.length;
				//i think this will work
				_this.players.push(player);
				//make call because it is new
				kfApiCall(index, player, true, friends || false)
					.then(function(){
						notifyObservers();
					});
			}
			//no current ajax call and forced
			else if(!exist.player.ajax && force) {
				//this force is always true
				kfApiCall(exist.index, exist.player, force, friends || false)
					.then(function(){
						notifyObservers();
					});
			}

		};

		var parseInput = function(player) {
			var splitArray = player.userinput.split('/');
			var splitArrayLength = splitArray.length;
			var urlGarbage = ["http:","","www.steamcommunity.com","steamcommunity.com","id","profiles"];
			for (var i=0;i < splitArrayLength;i++) {
				//find the part of the input that isn't garbage
				if (urlGarbage.indexOf(splitArray[i]) === -1) {
					//now check if it is a steam id or otherwise
					if (splitArray[i].indexOf("STEAM_0:") > 0) {
						player.query = steamIdConverter(splitArray[i]);
					}
					//it's probably a customURL or id64 at this point
					else {
						player.query = splitArray[i];
						break;						
					}

				}
			}
			if (typeof player.query === 'undefined') {
				//invalid input let user know here
			}
			return player;
			//fuck i need to learn how to regex a url
		};

		var steamIdConverter = function(id) {
			 var base = 76561197960265728;
			 var idArray = id.split(':');
			 var alpha = parseInt(idArray[1]);
			 var beta = parseInt(idArray[2]);
			 return (base + alpha + 2*beta);
		};

		var kfApiCall = function(index, player, force, friends) {
	        var deferred = $q.defer();
	        //if player data exists or is not forced, otherwise make a new request
	        if(typeof player.data !== undefined && !force) {
	            deferred.resolve(player.data);
	        } 
	        else {
	            _this.players[index].ajax = true;
	            var url = 'api/steam/1250/';
	            if(friends) {
	            	url+= 'userstats/'+player.query+'/friends';
	            }
	            else {
	            	url+= 'userstats/'+player.query;
	            }
	            $http.get(url)
	            .success(function(response) {
	                _this.players[index].ajax = false;
	                parseResult(index, response, friends);
	                deferred.resolve(_this.players[index]);
	            })
	            .error(function(response) {
	                console.log(response);
	                deferred.reject(response);
	            });
	        }
	        return deferred.promise;
	    };

	    var parseResult = function(index, data, friends) {
	    	_this.players[index].data = {};
	    	_this.players[index].data.summary = data.summary;
	    	_this.players[index].data.kfstats = data.kfstats;
	    	_this.players[index].data.maps = data.maps;
	    	if (friends) {
	    		_this.players[index].data.friends = data.friends;
	    	}
	    };

	}

})();