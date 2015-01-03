(function() {
	angular
		.module('EventsController',['EventsService'])
		.controller('EventsController', ['$scope','zones', 'events', 'EventsService','$interval','$http',EventsController]);

	function EventsController($scope, zones, events, EventsService, $interval, $http) {
		var _this = this;
		_this.zones = zones;
		_this.events = events;
		console.log(zones);
		console.log(events);


	}

})();