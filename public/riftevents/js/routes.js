(function() {
	angular
		.module('routes',['ui.router', 'EventsService'])
		.config(['$stateProvider','$urlRouterProvider', routes]);

	function routes($stateProvider,$urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		/*
		The table state
		*/
		$stateProvider.state('/', {
			url:'/',
			views: {
				"main": { 
					templateUrl:'partials/events.html',
					controller:'EventsController',
					controllerAs:'events'
				}
			},
			resolove: {
				EventsService: 'EventsService',
				events: ['EventsService', function(EventsService) {
					return EventsService.getEvents();
				}]
			}
		}); 

		/*
		The Map comparison state, expects a comma delimited string of steamids.
		Resolves the map json file and player stats for every player.
		*/
		$stateProvider.state('comparemaps', {
			url:'/comparemaps/:players',
			views: {
				'main': {
					templateUrl: 'partials/comparemaps.html',
					controller: 'kfCompareController',
					controllerAs: 'comparemaps'
				}
			},
			resolve: {
				KillingFloorService: 'KillingFloorService',
				kfMaps: ['KillingFloorService', function(KillingFloorService) {
					return KillingFloorService.getMaps();
				}],
				players: ['KillingFloorService', '$stateParams', function(KillingFloorService, $stateParams) {
					return KillingFloorService.getPlayers($stateParams.players);
				}]
			}
		});

	}

})();