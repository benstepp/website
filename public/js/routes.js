angular.module('routes',[]).config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {

	$routeProvider

        .when('/',
        {
            controller: 'EventsController',
            templateUrl: 'partials/events.html'
        })
        .when('/riftevents', 
        {
        	controller: 'EventsController',
        	templateUrl: 'partials/events.html'
        })
        .otherwise({ redirectTo: '/'});

    $locationProvider.html5Mode(true);
    
}]);