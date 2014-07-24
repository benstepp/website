(function() {
	angular.module('app', [
		'routes', 
		'EventsCtrl',
		'EventsService',
		'HeaderCtrl', 
		'MainCtrl', 
		'SocketFactory',
		'ui.router', 
		'routeStyles',
		'btford.socket-io'
		]);
})();