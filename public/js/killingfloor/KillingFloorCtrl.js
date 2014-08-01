(function() {
	angular
		.module('KillingFloorCtrl',['KillingFloorService', 'SteamService'])
		.controller('KillingFloorController', ['$scope', 'KillingFloorService', 'SteamService', KillingFloorCtrl]);

	function KillingFloorCtrl($scope, KillingFloorService, SteamService) {
		var _this = this;
		this.showTable = false;
		this.showPlayers = false;

		this.kfSearch = function(friends) {
			if (typeof _this.input === 'string' && _this.input !== "") {
				KillingFloorService.getPlayer(_this.input);
				if (friends) {
					SteamService.getFriends(_this.input).then(function(friends) {
						_this.friends = friends;
						_this.showPlayers = true;
					});
				}
				delete _this.input;
			}
		};

		this.addPlayer = function(player) {
			console.log(player);
		};

		this.getMaps = function() {
			this.kfMaps = KillingFloorService.getMaps()
				.then(function(data) {
					_this.kfMaps = data;
				});
		};

		var init = function() {
			_this.players = KillingFloorService.players;
			if (_this.players.length > 0) {
				_this.showTable = true;
			}
			_this.getMaps();
			KillingFloorService.registerObserverCallback(updatePlayers);
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