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

		this.getPlayer = function(userinput, force) {
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
					}
					);
			}

		};

		var parseInput = function(player) {
			player.query = player.userinput;
			return player;
			//fuck i need to learn how to regex a url
		};

		var kfApiCall = function(index, player, force) {
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
	    	_this.players[index].data.maps = data.maps;
	    };

	}

})();