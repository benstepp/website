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
			url:'/location/:tier/:calling/:locale',
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
					return LootService.getItemsByLocation($stateParams.tier,$stateParams.locale);
				}]
			}
		});

		/*
		The role state
		*/
		$stateProvider.state('role', {
			url:'/role/:calling/:role/:locale',
			views: {
				'main': {
					templateUrl: 'partials/role.html',
					controller: 'RoleController',
					controllerAs: 'lootByRole'
				}
			},
			resolve: {
				LootService: 'LootService',
				loot: ['LootService','$stateParams', function(LootService, $stateParams) {
					return LootService.getItemsByRole($stateParams.calling,$stateParams.role,$stateParams.locale);
				}]
			}
		});

	}

})();