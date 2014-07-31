(function() {
	angular.module('app', [
		'routes', 
		'EventsCtrl',
		'EventsService',
		'HeaderCtrl', 
		'MainCtrl', 
		'KillingFloorService',
		'KillingFloorCtrl',
		'SocketFactory',
		'ui.router', 
		'btford.socket-io',
		'ui.bootstrap',
		'ngEnter',
		'bsPlayerCard'
		]);
})();