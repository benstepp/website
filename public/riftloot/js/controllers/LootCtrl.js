(function() {
	angular
		.module('LootCtrl',['LootService'])
		.controller('LootController', ['$scope','loot', 'LootService','$interval','$http',LootCtrl]);

	function LootCtrl($scope, loot, LootService, $interval, $http) {
		var _this = this;

		_this.loot = loot;
	}
})();