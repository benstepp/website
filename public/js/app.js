(function() {
	angular.module('app', [
		//Vendor Dependencies
		'SocketFactory',
		'ui.router', 
		'btford.socket-io',
		'ui.bootstrap',
		//Main
		'routes', 
		'HeaderCtrl', 
		'MainCtrl', 
		'ngEnter',
		//RiftEvents
		'EventsCtrl',
		'EventsService',
		//KillingFloor
		'KillingFloorService',
		'KillingFloorCtrl',
		'bsPerks',
		//Steam
		'SteamService',
		'bsPlayerCard',

		'templates'
		]);
})();