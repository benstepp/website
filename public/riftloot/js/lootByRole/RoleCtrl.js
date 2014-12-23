(function() {
	angular
		.module('RoleCtrl',['LootService','AppDataService'])
		.controller('RoleController', ['$scope','loot', 'LootService','$interval','$http', 'AppDataService',RoleCtrl]);

	function RoleCtrl($scope, loot, LootService, $interval, $http, AppDataService) {
		var _this = this;

		_this.slots = ['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket','One Handed','Off Hand','Two Handed','Ranged','Greater Essence','Lesser Essence'];
		_this.loot = loot;
		_this.statWeights = {};
		_this.statWeightDefaults = {};
		_this.slot = getSavedSlot();
		_this.getOrder = getOrder;
		_this.hideItem = hideItem;
		_this.selectSlot = selectSlot;
		_this.getValue = getValue;
		_this.hideSlot = hideSlot;
		_this.getReadableValue = getReadableValue;

		function getOrder() {
			return function(obj) {
				return obj.value.order;
			};
		}

		function hideItem(item) {
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
		}

		function selectSlot(slot) {
			_this.slot = slot;
			AppDataService.saveData('slot',slot);
		}

		function getValue(item) {
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

			//if armor is weighted
			if (typeof _this.statWeights.Armor !== 'undefined') {
				itemValue += (_this.statWeights.Armor*item.armor);
			}

			//so items with set bonuses are invisibly higher than items without setbonus to the user
			if (typeof item.itemset_en !== 'undefined' || typeof item.itemset_de !== 'undefined' || typeof item.itemset_fr !== 'undefined' ) {
				itemValue += 0.0000001;
			}

			itemValue = Number(itemValue);
			item.itemValue = itemValue;
			return itemValue;

		}

		function hideSlot(slot) {
			var availableSlots = Object.keys(_this.loot);
			return availableSlots.indexOf(slot) === -1 ? true : false;
		}

		function getReadableValue(num) {
			return num.toFixed(2);
		}

		function getSavedSlot() {
			var availableSlots = Object.keys(_this.loot);
			var savedSlot = AppDataService.retrieveData('slot');
			//defaults to helmet if the particular slot is not available for that calling
			return availableSlots.indexOf(savedSlot) !== -1 ? savedSlot : 'Helmet';
		}

		//watches the statWeight object for changes
		$scope.$watchCollection(
			angular.bind(this,function(statWeights) {
				return this.statWeights;
			}), 
			function(newVal,oldVal) {
			
		});

	}
})();