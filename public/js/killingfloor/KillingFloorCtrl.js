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

		this.init = function() {
			this.players = [];
			_this.getMaps();
		};

		this.addPlayer = function() {
			KillingFloorService.getPlayer(_this.input)
				.then(function(data) {
					console.log(_this);
					_this.players.push(data);
					console.log(_this.players);
				});
			//clear the input field by deleting what it's bound to
			delete _this.input;
		};

		this.init();

	}
})();