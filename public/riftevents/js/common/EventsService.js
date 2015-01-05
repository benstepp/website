(function() {
    'use strict';

    angular
        .module('EventsService',[])
        .service('EventsService', ['$http','$q',EventsService]);

    function EventsService($http,$q) {
        var _this = this;

        //public methods
        _this.getZones = getZones;
        _this.getEvents = getEvents;

        //private variables
        var zoneEvents = {};
        var zones = {};

        //Calls for the zone object from the server
        //Expect an array wrapped in JSON object of the following objects for each zone:
        // { _id,name_en,name_de,name_fr }
        function getZones() {
        	var apiCallNeeded = Object.keys(zones).length === 0;
        	return $q.when(apiCallNeeded ? zonesApiCall() : zones);
        }

        function zonesApiCall() {
        	return $http.get("/api/riftevents/zones")
        		.then(function(res) {
        			zones = parseZones(res.data.zones);
        			return zones;
        		});
        }

        function parseZones(zonesFromServer) {
            //initialize zone reference with order and by _id
            var parsedZones = {};
            parsedZones.order = [];
            parsedZones.ref = {};

            //indexes of the start/end of each expansion
            parsedZones.count = {
                "Nightmare Tide":[0,2],
                "Storm Legion":[3,13],
                "Chocolate":[14,25]
            };

            angular.forEach(zonesFromServer, function(zone) {
                parsedZones.order.push(zone._id);
                parsedZones.ref[zone._id] = zone;
                //remove the unneeded _id key in the zone object
                delete parsedZones.ref[zone._id]._id;
            });

            //reverse the order of the zones so newest (higher level) content appears first
            parsedZones.order.reverse();

            return parsedZones;

        }

        //Gets the bulk events object from the server
        //This is called when first loading the app
        //Will use websockets if available otherwise
        function getEvents() {
        	var apiCallNeeded = Object.keys(zoneEvents).length === 0;
        	return $q.when(apiCallNeeded ? eventsApiCall() : zoneEvents);
        }

        function eventsApiCall() {
        	return $http.get("/api/riftevents/events")
        		.then(function(res) {
        			zoneEvents = parseEvents(res.data);
        			return zoneEvents;
        		});
        }

        function parseEvents(data) {
            angular.forEach(data, function(region){
                angular.forEach(region, function(eventArray) {
                    angular.forEach(eventArray, function(ev){
                        ev.order = zones.order.indexOf(ev.zone.toString());
                    });
                    eventArray.sort(eventSort);
                });
            });

            function eventSort(a,b) {
                return a.order - b.order;
            }

            return data;
        }
    }
})();