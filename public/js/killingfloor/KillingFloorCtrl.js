(function() {
	angular
		.module('KillingFloorCtrl',[])
		.controller('KillingFloorController', KillingFloorCtrl);

	function KillingFloorCtrl($scope) {
		
		this.init = function() {
			this.fields = {};
			this.fields.inputs = ApiService.inputs;
			this.kfMaps = ApiService.kfMaps;
		};

		this.printer = function() {
			console.log(_this.test);
		};

	}
})();