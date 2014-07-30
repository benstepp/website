(function() {
	angular
		.module('routes',['ui.router'])
		.config(['$stateProvider','$urlRouterProvider', routes]);

	function routes($stateProvider,$urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('index', {
			url:'/',
			views: {
				"main":{
					templateUrl:"partials/index/main.html",
					controller:"MainController"
				},
				"navbar-right": {
					templateUrl:"partials/index/navbar-right.html"
				}
			}
		});

		$stateProvider.state('riftevents', {
			url:'/riftevents',
			views: {
				"main": { 
					templateUrl:"partials/riftevents/main.html",
					controller:"EventsController",
					controllerAs:"riftevents"
				},
				"navbar-right": { 
					templateUrl:"partials/riftevents/navbar-right.html"
				},
				"footer-left": {
					templateUrl:"partials/riftevents/footer-left.html"
				}
			}
		}); 

		$stateProvider.state('killingfloor', {
			url:'/killingfloor',
			views: {
				"main": { 
					templateUrl:"partials/killingfloor/main.html",
					controller:"KillingFloorController",
					controllerAs:"kf"
				},
				"navbar-right": { 
					templateUrl:"partials/killingfloor/navbar-right.html",
				},
				"footer-left": {
					templateUrl:"partials/killingfloor/footer-left.html"
				}
			}
		}); 
	}

})();