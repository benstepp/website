(function() {
	angular
		.module('KillingFloorCtrl',['KillingFloorService'])
		.controller('KillingFloorController', ['$scope', 'KillingFloorService', KillingFloorCtrl]);

	function KillingFloorCtrl($scope, KillingFloorService) {
		var _this = this;
		this.showTable = false;
		this.showPlayers = false;

		this.kfSearch = function(friends) {
			if (typeof _this.input === 'string' && _this.input !== "") {
				KillingFloorService.getPlayer(_this.input, friends || false);
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