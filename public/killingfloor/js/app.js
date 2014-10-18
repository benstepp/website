(function() {
	angular.module('app', [
		//Vendor Dependencies
		'ui.router', 
		'mm.foundation',
		//Custom
		'bsEnter',
		'bsContentResize',
		'headerCtrl',
		//Steam
		'SteamService',
		'bsPlayerCard',
		//KillingFloorSpecific
		'routes', 
		'KillingFloorService',
		'kfFriendsCtrl',
		'kfInputCtrl',
		'kfCompareCtrl',
		'bsPerks'
		]);
})();