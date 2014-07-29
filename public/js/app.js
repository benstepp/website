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
		'routeStyles',
		'btford.socket-io',
		'ui.bootstrap',
		'ngEnter'
		]);
})();