(function() {
	angular
		.module('KillingFloorService',[])
		.service('KillingFloorService',['$http', '$q', KillingFloorService]);

	function KillingFloorService($http, $q) {
		var _this = this;

		this.kfMaps = {};
		this.players = [];

		/* this.players is an array of objects
		{	
			userinput: userinput, direct input from the user
			query: parsed query of userinput
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
		var getMaps = function() {
			$http.get("api/steam/1250/kfmaps")
				.success( function(response) {
					_this.kfMaps = response;
				});
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

		var getPlayer = function(userinput, force) {
			var exist = checkExist(userinput);
			//create it if it doesn't exist
			if (!exist) {
				var player = {
					"userinput":userinput,
					"ajax":false
				};
				//parse the userinput, returns object with query
				_this.parseInput(player);
				var index = _this.players.length;
				//i think this will work
				_this.players.push(player);
				//make call because it is new
				_this.kfApiCall(index, player, true);
			}
			//no current ajax call and forced
			else if(!exist.player.ajax && force) {
				//this force is always true
				_this.kfApiCall(exist.index, exist.player, force);
			}

		};

		var parseInput = function(player) {
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
	            $http.get('api/steam/1250/userstats/' + player.query)
	            .success(function(response) {
	                _this.players[index].ajax = false;
	                _this.parseResult(index, response);

	                deferred.resolve(_this.players[index].data);
	            })
	            .error(function(response) {
	                console.log(response);
	                deferred.reject(response);
	            });
	        }
	        return deferred.promise;
	    };

	    var parseResult = function(index, data) {
	    	_this.players[index].data.summary = data.summary;
	    	_this.players[index].data.kfstats = data.kfstats;
	    	_this.players[index].data.maps = data.kfmaps;
	    };

	}

})();