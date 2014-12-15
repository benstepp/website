(function() {
	angular
		.module('RoleCtrl',['LootService'])
		.controller('RoleController', ['$scope','loot', 'LootService','$interval','$http',RoleCtrl]);

	function RoleCtrl($scope, loot, LootService, $interval, $http) {
		var _this = this;
		_this.slots = ['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Ring','Seal','Trinket','One Handed','Two Handed','Ranged'];
		_this.loot = loot;

		_this.statWeights = {};
		_this.statWeightDefaults = {};

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

		_this.selectSlot = function(slot) {
			_this.slot = slot;
		};

		_this.getValue = function(item) {
			var itemValue = 0;

			//only if item has stats defined
			if (typeof item.onEquip !== 'undefined') {

				angular.forEach(item.onEquip,function(val) {
					//if it has a stat weight
					if (typeof _this.statWeights[val.name] !== 'undefined' || typeof _this.statWeightDefaults[val.name] !== 'undefined') {
						var stat = item.onEquip[val.name].value;
						var weight = _this.statWeights[val.name] || _this.statWeightDefaults[val.name];
						itemValue += stat*weight;
					}
				});

			}
			itemValue = new Number(itemValue);
			item.itemValue = itemValue;
			return itemValue;

		};

		_this.getReadableValue = function(num) {
			return num.toFixed(2);
		}

		//watches the statWeight object for changes
		$scope.$watchCollection(angular.bind(this,function(statWeights){return this.statWeights}), 
			function(newVal,oldVal) {
			
		});

	}
})();