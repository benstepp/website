(function() {
	angular.module('app', [
		//Vendor Dependencies
		'ui.router', 
		'mm.foundation',
		//Custom
		'bsContentResize',
		'HeaderCtrl',
		//RiftLoot
		'routes', 
		'LootService',
		'LootCtrl',
		'getOrder',
		'bsRiftTooltip',
		'bsCollapseDungeon'
		]);
})();