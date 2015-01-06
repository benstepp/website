(function() {
	'use strict';

	angular
		.module('EventsController',['EventsService','AppDataService'])
		.controller('EventsController', ['$scope','zones', 'events', 'EventsService','AppDataService','$interval',EventsController]);

	function EventsController($scope, zones, events, EventsService,AppDataService, $interval) {
		var _this = this;

		_this.zones = zones;
		_this.events = events;
		_this.getZone = getZone;
		_this.getDisplayedTime = getDisplayedTime;
		_this.showEvent = showEvent;

		var now = Date.now();
		var data = AppDataService.retrieveData();

		function getZone(id) {
			return _this.zones.ref[id].name_en;
		}

		function getDisplayedTime(time) {
			return Math.round((now/1000 - time)/60) + ' min';
		}

		function showEvent(ev) {
			var toShow = false;
			//check if shard is to be shown (this covers region and pvp)
			if (data.region.US.shard[ev.shard]) {
				toShow = true;
			}

			return toShow;
		}

		$interval(function() {now = Date.now();},15000);

	}

})();