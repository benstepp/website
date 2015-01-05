(function() {
	angular
		.module('EventsController',['EventsService'])
		.controller('EventsController', ['$scope','zones', 'events', 'EventsService','$interval','$http',EventsController]);

	function EventsController($scope, zones, events, EventsService, $interval, $http) {
		var _this = this;

		_this.zones = zones;
		_this.events = events;
		_this.getZone = getZone;
		_this.getDisplayedTime = getDisplayedTime;

		var now = Date.now();

		function getZone(id) {
			return _this.zones.ref[id].name_en;
		}

		function getDisplayedTime(time) {
			return Math.round((now/1000 - time)/60) + ' min';
		}

		$interval(function() {now = Date.now();},3000);

	}

})();