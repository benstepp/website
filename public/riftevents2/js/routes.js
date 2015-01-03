(function() {
	'use strict';

	angular
		.module('routes',['ui.router'])
		.config(['$stateProvider','$urlRouterProvider', routes]);

	function routes($stateProvider,$urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		/*
		The event state
		
		$stateProvider.state('event', {
			url:'/events',
			views: {
				'main': {
					templateUrl: 'partials/events.html',
					controller: 'EventController',
					controllerAs: 'riftevents'
				}
			},
			resolve: {
				EventsService: 'EventsService',
				loot: ['EventService','$stateParams', function(EventsService, $stateParams) {
					return EventsService.getItemsByLocation($stateParams.tier,$stateParams.locale);
				}]
			}
		});*/

	}

})();