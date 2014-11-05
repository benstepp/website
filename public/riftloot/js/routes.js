(function() {
	angular
		.module('routes',['ui.router', 'LootService'])
		.config(['$stateProvider','$urlRouterProvider', routes]);

	function routes($stateProvider,$urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		/*
		The splash state
		*/
		$stateProvider.state('/', {
			url:'/',
			views: {
				"main": { 
					templateUrl:'partials/splash.html'
				}
			}
		}); 

		/*
		The location state
		*/
		$stateProvider.state('location', {
			url:'/location/:tier/:class/:locale',
			views: {
				'main': {
					templateUrl: 'partials/location.html',
					controller: 'LootController',
					controllerAs: 'riftloot'
				}
			},
			resolve: {
				LootService: 'LootService',
				loot: ['LootService','$stateParams', function(LootService, $stateParams) {
					return LootService.getLoot($stateParams.tier,$stateParams.locale);
				}]
			}
		});

	}

})();