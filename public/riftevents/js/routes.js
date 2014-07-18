angular.module('routes',[]).config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {

	$routeProvider

        .when('/',
        {
            controller: 'EventsController',
            templateUrl: 'riftevents/partials/events.html'
        })
        .when('/riftevents', 
        {
        	controller: 'EventsController',
        	templateUrl: 'riftevents/partials/events.html'
        })
        .otherwise({ redirectTo: '/'});

    $locationProvider.html5Mode(true);
    
}]);