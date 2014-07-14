angular.module('EventsCtrl',['EventsService'])
	.controller('EventsController',
		function($scope, EventsService, $interval) {

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


			$scope.updateEvents = function(region) {
				EventsService.getEvents(region).then(
					function(data) {
						//clear the array for that region
						var newArray = [];
						//for each shard in the region
						for (var key in data[$scope.data.region]) {
							var eventLength = data[$scope.data.region][key].length;
							//for each event on the shard
							for (var i =0; i < eventLength;i++) {
								var newEvent = data[$scope.data.region][key][i];
								newEvent.started = $scope.toDate(newEvent.started);
								newEvent.shard = key;
								newArray.push(newEvent);
							}
						}
						$scope.events = newArray;
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
			$scope.updateEvents();

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