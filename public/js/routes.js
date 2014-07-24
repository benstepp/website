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
					controller:"EventsController"
				},
				"navbar-right": { 
					templateUrl:"partials/riftevents/navbar-right.html"
				},
				"footer-left": {
					templateUrl:"partials/riftevents/footer-left.html"
				}
			}
		}); 
	}

})();