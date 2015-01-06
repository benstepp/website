(function() {
	'use-strict';
	
	angular.module('app', [
		//Vendor Dependencies
		'ui.router', 
		'ngMaterial',

		//Global App Modules
		'mdTheme',
		'routes',

		'EventsService',
		'sideNavController',

		//Individual Views
		'EventsController',
		'SettingsController'


		]);
})();