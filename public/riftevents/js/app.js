(function() {
	angular.module('app', [
		//Vendor Dependencies
		'ui.router', 
		'mm.foundation',
		'btford.socket-io',
		'SocketFactory',
		//Custom
		'HeaderCtrl',
		//RiftEvents
		'routes', 
		'EventsService',
		'EventsCtrl'
		]);
})();