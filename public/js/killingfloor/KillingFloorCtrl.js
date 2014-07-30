(function() {
	angular
		.module('KillingFloorCtrl',['KillingFloorService'])
		.controller('KillingFloorController', KillingFloorCtrl);

	function KillingFloorCtrl($scope, KillingFloorService) {
		var _this = this;
		this.showTable = false;

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