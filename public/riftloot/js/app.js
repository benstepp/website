(function() {
	angular.module('app', [
		//Vendor Dependencies
		'ui.router', 
		'mm.foundation',
		//Custom
		'bsContentResize',
		'HeaderCtrl',
		//RiftEvents
		'routes', 
		'LootService',
		'LootCtrl',
		'getOrder'
		]);
})();