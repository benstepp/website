(function() {
	'use-strict';
	
	angular.module('app', [
		//Vendor Dependencies
		'ui.router', 
		'mm.foundation',
		'pascalprecht.translate',
		//Custom
		'bsContentResize',
		'HeaderCtrl',
		//RiftLoot
		'routes', 
		'LootService',
		'LootCtrl',
		'RoleCtrl',
		'getOrder',
		'bsRiftTooltip',
		'bsCollapseDungeon',
		'bsSideNavPosition',
		'bsSlotSelector',
		'bsStatWeightForm',
		'AppDataService'
		]);
})();