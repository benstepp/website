(function() {
	angular
		.module('routes',['ui.router', 'EventsService'])
		.config(['$stateProvider','$urlRouterProvider', routes]);

	function routes($stateProvider,$urlRouterProvider) {

		$urlRouterProvider.otherwise('active');

		/*
		The table state
		*/
		$stateProvider.state('/', {
			url:'/',
			views: {
				"main": { 
					templateUrl:'partials/events.html'
				}
			},
			resolve: {
				EventsService: 'EventsService',
				zones:['EventsService', function(EventsService) {
					return EventsService.getZones();
				}],
				events: ['EventsService', function(EventsService) {
					return EventsService.getEvents();
				}]
			}
		}); 

		/*
		The active zone event state requires valid region and locale parameters
		otherwise it will default to US/en
		*/
		$stateProvider.state('active', {
			url:'/active/:region/:locale',
			views: {
				'main': {
					templateUrl: 'partials/events.html',
					controller: 'EventsController',
					controllerAs: 'riftevents'
				}
			},
			resolve: {
				EventsService: 'EventsService',
				zones:['EventsService', function(EventsService) {
					return EventsService.getZones();
				}],
				events: ['EventsService', function(EventsService, $stateParams) {
					return EventsService.getEvents($stateParams.region);
				}]
			}
		});

	}

})();