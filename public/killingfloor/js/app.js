(function() {
	angular.module('app', [
		//Vendor Dependencies
		'ui.router', 
		'mm.foundation',
		'ngEnter',
		//KillingFloor
		'routes', 
		'KillingFloorService',
		'KillingFloorCtrl',
		'bsPerks',
		//Steam
		'SteamService',
		'bsPlayerCard'
		]);
})();