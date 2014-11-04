(function() {
	angular
		.module('routes',['ui.router', 'LootService'])
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
					templateUrl:'partials/events.html'
				}
			},
			resolve: {
				LootService: 'LootService',
				zones:['LootService', function(LootService) {
					return LootService.getZones();
				}],
				events: ['LootService', function(LootService) {
					return LootService.getEvents();
				}]
			}
		}); 

		/*
		The loot state
		*/
		$stateProvider.state('loot', {
			url:'/:tier/:class/:locale',
			views: {
				'main': {
					templateUrl: 'partials/events.html',
					controller: 'EventsController',
					controllerAs: 'riftevents'
				}
			},
			resolve: {
				LootService: 'LootService',
				zones:['LootService', function(LootService) {
					return LootService.getZones();
				}],
				events: ['LootService', function(LootService, $stateParams) {
					return LootService.getEvents($stateParams.region);
				}]
			}
		});

	}

})();