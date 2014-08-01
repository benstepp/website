(function() {
	angular
		.module('KillingFloorCtrl',['KillingFloorService', 'SteamService'])
		.controller('KillingFloorController', ['$scope', 'KillingFloorService', 'SteamService', KillingFloorCtrl]);

	function KillingFloorCtrl($scope, KillingFloorService, SteamService) {
		var _this = this;
		//controls the views in the main ui-view


		this.kfSearch = function(friends) {
			if (typeof _this.input === 'string' && _this.input !== "") {
				KillingFloorService.getPlayer(_this.input);
				if (friends) {
					SteamService.getFriends(_this.input).then(function(friends) {
						_this.friends = friends;
						_this.showPlayers();
					});
				}
				delete _this.input;
			}
		};

		this.showPlayers = function() {
			if (_this.players.length > 0) {
				_this.viewInput = false;
				_this.viewTable = false;
				_this.viewPlayers = true;
			}
		};

		this.showStats = function() {
			if (_this.players.length > 0) {
				_this.viewInput = false;
				_this.viewTable = true;
				_this.viewPlayers = false;
			}
		};

		this.addPlayer = function(player) {
			if (player.communityVisibilityState === 1) {
				//alert that you cannot add a private profile
			}
			else {
				var playerObj = {
					data:{}
				};
				playerObj.data.summary = player;
				var index = _this.friends.indexOf(player);
				_this.friends.splice(index,1);
				KillingFloorService.getPlayerByObj(playerObj);
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
			if (typeof _this.userInput === 'undefined') {
				_this.userInput = KillingFloorService.players[0];
			}
			_this.players = KillingFloorService.players;
			_this.showTable = true;
		};

		this.clearScope = function() {
			_this.players = [];
			KillingFloorService.players = [];
			this.showTable = false;
		};

		init();

	}
})();