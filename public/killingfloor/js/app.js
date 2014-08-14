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
		'KillingFloorCtrl',
		'bsPerks',
		//Steam
		'SteamService',
		'bsPlayerCard'
		]);
})();