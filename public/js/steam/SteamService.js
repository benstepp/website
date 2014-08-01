(function() {
	angular
		.module('SteamService',[])
		.service('SteamService',['$http', '$q', SteamService]);

	function SteamService($http, $q) {

		var _this = this;

		var observerCallbacks = [];
		this.registerObserverCallback = function(callback) {
			observerCallbacks.push(callback);
		};

		var notifyObservers = function() {
			angular.forEach(observerCallbacks, function(callback) {
				callback();
			});
		};

		this.getFriends = function(userinput) {
			var player = {
					"userinput":userinput,
					"ajax":false
				};
			this.parseInput(player);
			var deferred = $q.defer();
	        var url = 'api/steam/friends/'+ player.query;
	        $http.get(url)
	            .success(function(response) {
	            	deferred.resolve(response.friends);
	            })
	            .error(function(response) {
	                console.log(response);
	                deferred.reject(response);
	            });
	        return deferred.promise;		
		};

		this.parseInput = function(player) {
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

	}

})();