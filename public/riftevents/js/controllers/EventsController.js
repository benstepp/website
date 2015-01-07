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
		_this.noMore = noMore;
		_this.tag = tag;

		init();

		var now = Date.now();
		var data = AppDataService.retrieveData();

		function getZone(id) {
			return _this.zones.ref[id].name_en;
		}

		function getDisplayedTime(time) {
			return Math.round((now/1000 - time)/60) + ' min';
		}

		function showEvent(ev) {
			var checks = [];
			var toShow = true;

			//check if shard is to be shown (this covers region and pvp)
			checks.push(data.region[ev.region].shard[ev.shard]);
			//check if the zone is to be shown
			checks.push(data.zone[ev.zone]);

			//any false check (hide the event)
			angular.forEach(checks, function(check) {
				if (!check) {toShow = check;}
			});

			//otherwise show and save a reference for the more function
			ev.toShow = toShow;
			return toShow;
		}

		function noMore() {
			var more = true;
			angular.forEach(_this.events, function(val,key) {
				//event is visible, we don't need to look at last
				if (val.toShow) {more = false;}
			});
			//all events are not visible so show the no more
			return more;
		}

		function tag(ev){
			var tagged = (typeof ev.tagged === 'undefined') ? true : !ev.tagged;
			EventsService.tag(ev.unid,tagged);
		}

		function init() {
			$interval(function() {now = Date.now();},15000);
			EventsService.registerObserver(function() {
				EventsService.getEvents().then(function(data) {
					_this.events = data;
				});
			});
		}
		

	}

})();