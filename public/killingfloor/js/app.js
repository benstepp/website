(function() {
	angular.module('app', [
		//Vendor Dependencies
		'ui.router', 
		'mm.foundation',
		//Main
		'routes', 
		'ngEnter',
		'OffCanvasCtrl',
		//KillingFloor
		'KillingFloorService',
		'KillingFloorCtrl',
		'bsPerks',
		//Steam
		'SteamService',
		'bsPlayerCard'
		]);
})();