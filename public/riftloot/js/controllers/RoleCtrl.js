(function() {
	angular
		.module('RoleCtrl',['LootService'])
		.controller('RoleController', ['$scope','loot', 'LootService','$interval','$http',RoleCtrl]);

	function RoleCtrl($scope, loot, LootService, $interval, $http) {
		var _this = this;
		_this.slots = ['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Ring','Seal','Trinket','One Handed','Two Handed','Ranged'];
		_this.loot = loot;

		_this.getOrder = function() {
			return function(obj) {
				return obj.value.order;
			};
		};

		_this.hideItem = function(item) {
			var toShow = $scope.header.data.class;
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

	}
})();