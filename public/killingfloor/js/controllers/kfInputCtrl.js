(function() {
	angular
		.module('kfInputCtrl',['KillingFloorService', 'SteamService', 'ui.router'])
		.controller('kfInputController', ['$scope', '$state','KillingFloorService', 'SteamService', kfInputController]);

	function kfInputController($scope, $state, KillingFloorService, SteamService) {

		//sends the user to the comparemaps state once stats resolved.
		this.kfSearch = function(input) {
			$state.go('comparemaps', {
				players: input
			});
		};

	}
	
})();