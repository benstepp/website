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
					//we also need regrab events for that region
					$scope.updateEvents($scope.region);
			});


			$scope.updateEvents = function(region) {
				EventsService.getEvents(region).then(
					function(data) {
						//clear the array for that region
						var newArray = [];
						//for each shard in the region
						for (var key in data[$scope.region]) {
							var eventLength = data[$scope.region][key].length;
							//for each event on the shard
							for (var i =0; i < eventLength;i++) {
								var newEvent = data[$scope.region][key][i];
								newEvent.shard = key;
								newArray.push(newEvent);
							}
						}
						$scope.events = newArray;
					});
			};

			//init with no region specified
			$scope.updateEvents();

			$interval(function() {
				EventsService.checkUpdated().then(
					function(res) {
						//we expect a true or false value from this function
						if(res) {
							console.log('getting new events');
							$scope.updateEvents($scope.region);
						}
					});
			}, 30000);
});