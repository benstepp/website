angular.module('EventsCtrl',['EventsService'])
	.controller('EventsController',
		function($scope, EventsService, $interval) {

			$scope.events = {};
			$scope.region = $scope.$parent.region;
			//watches for region change in header controller
			$scope.$watchCollection(
				'$parent.region', 
				function() {
					$scope.region = $scope.$parent.region;
			});


			$scope.updateEvents = function(region) {
				console.log('updating Events');
				EventsService.getEvents(region).then(
					function(data) {
						$scope.events = data;
					});
			};

			//init with no region specified
			$scope.updateEvents();
			//$interval($scope.updateEvents($scope.region), 60000);
			$interval(EventsService.checkUpdated(), 1);
});