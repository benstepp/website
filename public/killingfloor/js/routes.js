(function() {
	angular
		.module('routes',['ui.router'])
		.config(['$stateProvider','$urlRouterProvider', routes]);

	function routes($stateProvider,$urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('/', {
			url:'/',
			views: {
				"main": { 
					templateUrl:"partials/input.html",
					controller:"KillingFloorController",
					controllerAs:"kf"
				}
			}
		}); 

		$stateProvider.state('comparemaps', {
			url:'/comparemaps',
			views: {
				'main': {
					templateUrl: 'partials/comparemaps.html',
					controller: 'KillingFloorController',
					controllerAs: 'kf'
				}
			},
			resolve: {
				friends: 
			}
		});

		var getPlayer = function() {

		};

		$stateProvider.state('addfriends', {
			url:'/addfriends',
			views: {
				'main': {
					templateUrl: 'partials/addfriends.html',
					controller: 'KillingFloorController',
					controllerAs: 'kf'
				}
			}
		});

	}

})();