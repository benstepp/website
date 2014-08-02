(function() {
	angular
		.module('KillingFloorCtrl',['KillingFloorService', 'SteamService'])
		.controller('KillingFloorController', ['$scope', 'KillingFloorService', 'SteamService', KillingFloorCtrl]);

	function KillingFloorCtrl($scope, KillingFloorService, SteamService) {
		var _this = this;
		//controls the views in the main ui-view
		var controlView = false;

		//the help tooltip
		this.help =[
			'<p>The following are valid formats</p>',
			'<code>http://www.steamcommunity.com/profiles/SteamID64</code>',
			'<code>http://www.steamcommunity.com/profiles/CustomURL</code>',
			'<code>SteamID64</code>',
			'<code>CustomURL</code>',
			].join('');

		this.kfSearch = function(friends) {
			if (typeof _this.input === 'string' && _this.input !== "") {
				SteamService.getFriends(_this.input).then(function(friends) {
					_this.friends = friends;
					_this.showPlayers();
				});
				KillingFloorService.getPlayer(_this.input);
				delete _this.input;
			}
		};

		this.setView = function() {
			controlView = true;
		};
		this.removeView = function() {
			controlView = false;
		}

		this.showPlayers = function() {
			if (_this.players.length > 0) {
				_this.viewInput = false;
				_this.viewTable = false;
				_this.viewPlayers = true;
			}
		};

		this.showStats = function() {
			if (controlView) {
				_this.viewInput = false;
				_this.viewTable = true;
				_this.viewPlayers = false;
			}
		};

		this.addPlayer = function(player) {
			var newPlayer = {
				'data':player.data,
				'query':player.data.summary.steamid,
				'class':""
			};
			//remove player
			if (player.added) {
				var index = _this.players.indexOf(player);
				_this.players.splice(index,1);
				KillingFloorService.removePlayer(player.data.summary.steamid);
				_this.friends.push(newPlayer);
			}
			//add player
			else {
				if (player.data.summary.communityVisibilityState === 1) {
					//alert that you cannot add a private profile
				}
				else {
					newPlayer.added = true;
					var indexa = _this.friends.indexOf(player);
					_this.friends.splice(indexa,1);
					KillingFloorService.getPlayerByObj(newPlayer);
				}
			}
		};

		this.removePlayer = function(player) {
			var index = _this.players.indexOf(player);
			_this.players.splice(index,1);
			player = player.data.summary;
			_this.friends.push(player);
		};

		this.getMaps = function() {
			this.kfMaps = KillingFloorService.getMaps()
				.then(function(data) {
					_this.kfMaps = data;
				});
		};

		var init = function() {
			_this.players = KillingFloorService.players;
			_this.friends = SteamService.friends;
			if (_this.players.length > 0) {
				_this.viewTable = true;
				_this.viewPlayers = false;
				_this.viewInput = false;
			}
			else if (_this.friends.length > 0) {
				_this.viewTable = false;
				_this.viewPlayers = true;
				_this.viewInput = false;
			}
			else {
				_this.viewTable = false;
				_this.viewPlayers = false;
				_this.viewInput = true;
			}
			_this.getMaps();
			KillingFloorService.registerObserverCallback(updatePlayers);
			$scope.header.registerMainScope(_this);
		};

		var updatePlayers = function() {
			_this.players = KillingFloorService.players;
			_this.showStats();
		};

		init();

	}
})();