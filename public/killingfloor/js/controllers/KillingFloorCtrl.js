(function() {
	angular
		.module('KillingFloorCtrl',['KillingFloorService', 'SteamService', 'ui.router'])
		.controller('KillingFloorController', ['$scope', '$state', 'KillingFloorService', 'SteamService', KillingFloorCtrl]);

	function KillingFloorCtrl($scope, $state, KillingFloorService, SteamService) {
		console.log($state);
		var _this = this;

		//object of players with data
		this.players = {};
		this.playersArray = [];
		
		//the help tooltip
		this.help =[
			'<p>The following are valid inputs:</p>',
			'<code>http://www.steamcommunity.com/profiles/SteamID64/</code>',
			'<code>http://www.steamcommunity.com/id/CustomURL/</code>',
			'<code>SteamID64</code>',
			'<code>CustomURL</code>',
			'<code>STEAM_0:#:########</code>'
			].join('');

		/*this.kfSearch = function(input) {
			$location.path('/addfriends');
			if (typeof input === 'string' && input !== "" ) {
				KillingFloorService.getPlayer(_this.input)
					.then(function(player) {
						KillingFloorService.mainPlayer = player;
						updatePlayers();
					});
				SteamService.getFriends(_this.input)
					.then(function(friends) {
						updatePlayers();
					});
				delete _this.input;
			}
			if (typeof input === 'object') {
				KillingFloorService.getPlayer(input)
					.then(function() {
						updatePlayers();
					});
			}
		};*/

		this.kfSearch = function(input) {
			console.log(input);
			$state.go('comparemaps', 
				{
					players: [input]
				});
		};

		//Make ajax call to get json of the maps
		var getMaps = function() {
			this.kfMaps = KillingFloorService.getMaps()
				.then(function(maps) {
					_this.kfMaps = maps;
				});
		};

		var updatePlayers = function() {
			_this.players = SteamService.friends;
			_this.mainPlayer = KillingFloorService.mainPlayer;
			_this.players = combine(_this.players,KillingFloorService.players);
			_this.playersArray = updatePlayerArray();
		};

		var combine = function(oldObj, newObj) {
			for (var key in newObj) {
				oldObj[key] = newObj[key];
			}
			return oldObj;
		};

		var updatePlayerArray = function() {
			var oldPlayers = _this.playersArray;
			var playersArrayLength = oldPlayers.length;
			//for each player in object
			angular.forEach(_this.players, function(val,key) {
				//for each player in the array
				var i = 0;
				do {
					//if the player was not in array and we are at the end of it.
					if ( i === playersArrayLength) {
						oldPlayers.push(val);
					}
					//if the player is already in the array
					if (oldPlayers[i].data.summary.steamid === key) {
						oldPlayers.splice(i, 1, val);
					}
					i++;
				} while (i < playersArrayLength);
			});
			return oldPlayers;
		};

		var init = function() {
			updatePlayers();
			getMaps();
			KillingFloorService.registerObserverCallback(updatePlayers);
		};

		init();

	}
})();