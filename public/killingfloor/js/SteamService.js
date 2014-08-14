(function() {
	angular
		.module('SteamService',[])
		.service('SteamService',['$http', '$q', SteamService]);

	function SteamService($http, $q) {

		var _this = this;
		this.friends = {};

		var observerCallbacks = [];
		this.registerObserverCallback = function(callback) {
			observerCallbacks.push(callback);
		};

		var notifyObservers = function() {
			angular.forEach(observerCallbacks, function(callback) {
				callback();
			});
		};

		this.getFriends = function(input) {
			var deferred = $q.defer();
			//if input is specified, from either url or userinput
			if (typeof input !== 'object') {
				var player = {
					"userinput":input,
					"ajax":false
				};
				this.parseInput(player);
				friendApiCall(player)
					.then(function(friends) {
						deferred.resolve(_this.friends);
					});
			}
			else {
				//loop through keys of friends object to see if there are friends
				var keys = [];
				angular.forEach(_this.friends, function(val,key) {
					keys.push(key);
				});
				if (keys.length > 0) {
					deferred.resolve(_this.friends);
				}
				else {

				}

			}
			
			

			return deferred.promise;
		};

		var friendApiCall = function(player) {
			var deferred = $q.defer();
	        var url = '/api/steam/friends/'+ player.query;
	        $http.get(url)
	            .success(function(response) {
	            	var friends = response.friends;
	            	var friendsLength = response.friends.length;
	            	for (var i = 0; i < friendsLength; i ++) {
	            		friends[i] = _this.fullUrls(friends[i]);
	            		var friend = friends[i];
	            		friends[i] = {
	            			data:{
	            				summary:friend
	            			}
	            		};
	            	}
	            	saveFriends(friends);
	            	deferred.resolve(_this.friends);
	            })
	            .error(function(response) {
	                console.log(response);
	                deferred.reject(response);
	            });
	        return deferred.promise;		
		};

		var saveFriends = function(friends) {
			var length = friends.length;
			for (var i = 0; i < length; i++) {
				var friend = friends[i];
				_this.friends[friends[i].data.summary.steamid] = friend;
			}
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

		this.fullUrls = function(player) {
			player.avatar = '//media.steampowered.com/steamcommunity/public/images/avatars/'+player.avatar;
			player.profileUrl = '//www.steamcommunity.com/' + player.profileUrl;
			return player;
		};

		var steamIdConverter = function(id) {
			 var base = '76561197960';
			 var idArray = id.split(':');
			 var alpha = parseInt(idArray[1]);
			 var beta = parseInt(idArray[2]);
			 return (base + (alpha + 265728 + 2*beta).toString());
		};

	}

})();