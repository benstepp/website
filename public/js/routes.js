(function() {
	angular
		.module('routes',['routeStyles', 'ui.router'])
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
			css:'/partials/riftevents/riftevents.css',
			views: {
				"main": { 
					templateUrl:"partials/riftevents/main.html",
					controller:"EventsController as riftevents"
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
			css:'/partials/killingfloor/killingfloor.css',
			views: {
				"main": { 
					templateUrl:"partials/killingfloor/main.html",
					controller:"KillingFloorController as kf"
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