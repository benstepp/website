(function() {
	angular
		.module('KillingFloorCtrl',['KillingFloorService'])
		.controller('KillingFloorController', KillingFloorCtrl);

	function KillingFloorCtrl($scope, KillingFloorService) {
		var _this = this;

		this.getMaps = function() {
			this.kfMaps = KillingFloorService.getMaps()
				.then(function(data) {
					_this.kfMaps = data;
				});
		};

		var init = function() {
			this.players = [];
			_this.getMaps();
			KillingFloorService.registerObserverCallback(updatePlayers);
		};

		var updatePlayers = function() {
			_this.players = KillingFloorService.players;
		};

		init();

	}
})();