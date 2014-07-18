angular.module('EventsCtrl',['EventsService'])
	.controller('EventsController',
		function($scope, EventsService, $interval, $http) {

			$scope.events = {};
			$scope.region = $scope.$parent.region;
			//watches for region change in header controller
			$scope.$watchCollection(
				'$parent.data', 
				function() {
					$scope.data = $scope.$parent.data;
					//we also need regrab events for that region
					$scope.updateEvents($scope.data.region);
			});

			//defines a sorting predicate
			$scope.predicate = "";
			$scope.reverse = false;

			//get zones json file
			$http.get("api/riftevents/zones")
				.success(function(response){
					$scope.zones = response;
					$scope.updateEvents();
				});

			$scope.sort = function(str) {
				//only reverse if it is already the sort method
				if ($scope.predicate === str) {
					$scope.reverse = !$scope.reverse;
				}
				//otherwise reset the reverse
				else {
					$scope.predicate = str;
					$scope.reverse = false;
				}
			};

			$scope.updateEvents = function(region) {
				EventsService.getEvents(region).then(
					function(data) {
						var newEvents = data[$scope.data.region].events;
						var newEventsLength = newEvents.length;
						//get correct time and zone name
						var locale = $scope.data.locale.slice(0,2);
						for (var i=0; i < newEventsLength;i++) {
							newEvents[i].time = $scope.toDate(newEvents[i].started);
							newEvents[i].zone = $scope.zones[newEvents[i].zone]['name_'+locale];
							newEvents[i].name = newEvents[i]['name_'+locale];
						}
						$scope.events = newEvents;
					});
			};

			$scope.toDate = function(date) {
				var d = new Date(date*1000);
				var options = {
					'hour': 'numeric',
					'minute':'2-digit'
				};
				return d.toLocaleString($scope.data.locale, options);
			};



			//init with no region specified

			$interval(function() {
				EventsService.checkUpdated().then(
					function(res) {
						//we expect a true or false value from this function
						if(res) {
							console.log('getting new events');
							$scope.updateEvents($scope.data.region);
						}
					});
			}, 30000);
});