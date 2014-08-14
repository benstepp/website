(function() {
	angular.module('app', [
		//Vendor Dependencies
		'ui.router', 
		'mm.foundation',
		'ngEnter',
		//KillingFloor
		'routes', 
		'KillingFloorService',
		'kfFriendsCtrl',
		'kfInputCtrl',
		'kfCompareCtrl',
		'KillingFloorCtrl',
		'bsPerks',
		//Steam
		'SteamService',
		'bsPlayerCard'
		]);
})();