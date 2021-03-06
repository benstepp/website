(function() {
	'use strict';

	angular
		.module('routes',['ui.router','EventsService'])
		.config(['$stateProvider','$urlRouterProvider', routes]);

	function routes($stateProvider,$urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		/*
		The event state
		*/
		$stateProvider.state('/', {
			url:'/',
			views: {
				'main': {
					templateUrl: 'partials/events.html',
					controller: 'EventsController',
					controllerAs: 'riftevents'
				}
			},
			resolve: {
				EventsService: 'EventsService',
				zones: ['EventsService', function(EventsService) {
					return EventsService.getZones();
				}],
				events: ['EventsService', function(EventsService) {
					return EventsService.getEvents();
				}]
			}
		});

		/*
		The settings state
		*/
		$stateProvider.state('settings', {
			url:'/settings',
			views: {
				'main': { 
					templateUrl:'partials/settings.html',
					controller: 'SettingsController',
					controllerAs: 'settings'
				}
			},
			resolve: {
				EventsService: 'EventsService',
				zones: ['EventsService', function(EventsService) {
					return EventsService.getZones();
				}]
			}
		});

	}

})();