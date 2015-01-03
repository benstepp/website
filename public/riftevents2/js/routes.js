(function() {
	'use strict';

	angular
		.module('routes',['ui.router','EventsService'])
		.config(['$stateProvider','$urlRouterProvider', routes]);

	function routes($stateProvider,$urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('/', {
			url:'/',
			views: {
				'main': { 
					templateUrl:'partials/splash.html'
				}
			}
		}); 

		/*
		The event state
		*/
		$stateProvider.state('event', {
			url:'/events',
			views: {
				'main': {
					templateUrl: 'partials/events.html',
					controller: 'EventsController',
					controllerAs: 'riftevents'
				}
			},
			resolve: {
				EventsService: 'EventsService',
				events: ['EventsService', function(EventsService) {
					return EventsService.getEvents();
				}],
				zones: ['EventsService', function(EventsService) {
					return EventsService.getZones();
				}],
			}
		});

	}

})();