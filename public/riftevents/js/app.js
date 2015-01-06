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
		'AppDataService',
		'NotificationService',
		'sideNavController',

		//Individual Views
		'EventsController',
		'SettingsController'


		]);
})();