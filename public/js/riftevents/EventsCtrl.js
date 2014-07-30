(function() {
	angular
		.module('EventsCtrl',['EventsService'])
		.controller('EventsController', ['$scope','EventsService','$interval','$http','socket',EventsCtrl]);

	function EventsCtrl($scope, EventsService, $interval, $http, socket) {
		var _this = this;

		this.events = {};
		//watches for region change in header controller
		$scope.$watchCollection(
			'header.data', 
			function() {
				_this.data = $scope.header.data;
				//we also need regrab events for that region
				_this.updateEvents(_this.data.region);
		});

		//defines a sorting predicate
		this.predicate = "";
		this.reverse = false;

		//get zones json file
		$http.get("api/riftevents/zones")
			.success(function(response){
				_this.zones = response;
				_this.updateEvents();
			});

		this.sort = function(str) {
			//only reverse if it is already the sort method
			if (this.predicate === str) {
				this.reverse = !this.reverse;
			}
			//otherwise reset the reverse
			else {
				this.predicate = str;
				this.reverse = false;
			}
		};

		this.updateEvents = function(region) {
			EventsService.getEvents(region).then(
				function(data) {
					var newEvents = data[_this.data.region].events;
					var newEventsLength = newEvents.length;
					//get correct time and zone name
					var locale = _this.data.locale.slice(0,2);
					for (var i=0; i < newEventsLength;i++) {
						newEvents[i].time = _this.toDate(newEvents[i].started);
						newEvents[i].zone = _this.zones[newEvents[i].zone]['name_'+locale];
						newEvents[i].name = newEvents[i]['name_'+locale];
					}
					_this.events = newEvents;
				});
		};

		this.toDate = function(date) {
			var d = new Date(date*1000);
			var hr = d.getHours();
			var min = d.getMinutes();
			var apm = "";
			//special case for 24 hr/12am
			if (hr === 24 && this.data.locale === "en-US") {
				apm = " AM";
                hr=12;
            }
			else if (hr >= 12 && this.data.locale === "en-US") {
				apm = " PM";
				hr = hr-12;
				}
			else if (hr < 12 && this.data.locale === "en-US") {
				apm = " AM";
			}
			if(min < 10) {
				min = "0"+min;
			}
            return  hr + ":" + min + apm;
        };



		//init with no region specified
		/*
		$interval(function() {
			EventsService.checkUpdated().then(
				function(res) {
					//we expect a true or false value from this function
					if(res) {
						$scope.updateEvents($scope.data.region);
					}
				});
		}, 30000);*/

		//client socket.io
		socket.on('addEvent', function(data) {
			this.msg = data;
		});

		socket.on('removeEvent', function(data) {
			this.msg = data;
		});
	}
})();