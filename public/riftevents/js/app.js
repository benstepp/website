(function() {
	angular.module('app', [
		//Vendor Dependencies
		'ui.router', 
		'mm.foundation',
		'btford.socket-io',
		'SocketFactory',
		//Custom
		'bsContentResize',
		'HeaderCtrl',
		//RiftEvents
		'routes', 
		'EventsService',
		'EventsCtrl'
		]);
})();