(function() {
	angular
		.module('LootCtrl',['LootService'])
		.controller('LootController', ['$scope','loot', 'LootService','$interval','$http',LootCtrl]);

	function LootCtrl($scope, loot, LootService, $interval, $http) {
		var _this = this;

		_this.loot = loot;

		_this.getOrder = function() {
			return function(obj) {
				return obj.value.order;
			};
		};

		_this.hideItem = function(item) {
			var toShow = $scope.header.data.calling;
			if (toShow === 'all') {
				return false;
			}
			else if(item.calling.indexOf(toShow) === -1) {
				return true;
			}
			else{
				return false;
			}
		};

		_this.getTier = function(tier) {
			var readable = {
				expert:'Expert',
				raid1:'Raid I'
			};
			return readable[tier];
		};

	}
})();