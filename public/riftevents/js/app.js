(function() {
	'use-strict';
	
	angular.module('app', [
		//Vendor Dependencies
		'ui.router', 
		'ngMaterial',
		'pascalprecht.translate',

		//Global App Modules
		'mdTheme',
		'routes',
		'translations',
		
		'EventsService',
		'AppDataService',
		'NotificationService',

		'sideNavController',

		//Individual Views
		'EventsController',
		'SettingsController'
		]);
})();