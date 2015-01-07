(function() {
    'use strict';

    angular
        .module('EventsService',[])
        .service('EventsService', ['$http','$q','$interval',EventsService]);

    function EventsService($http,$q,$interval) {
        var _this = this;

        //public methods
        _this.getZones = getZones;
        _this.getEvents = getEvents;
        _this.registerObserver = registerObserver;
        _this.tag = tag;

        //private variables
        var zoneEventsOld;
        var zoneEvents = {};
        var zones = {};
        var observerCallbacks = [];
        var sessionTags = {};

        init();

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

            //setting up easy access for the settings controller
            parsedZones.expansion = {};
            angular.forEach(parsedZones.count, function(val,key) {
                var indexes = parsedZones.count[key];
                var zonesForExpansion = parsedZones.order.slice(indexes[0],indexes[1]+1);
                
                angular.forEach(zonesForExpansion, function(val,key) {
                    zonesForExpansion[key] = parsedZones.ref[val];
                    zonesForExpansion[key]._id = val;
                });

                parsedZones.expansion[key] = zonesForExpansion;
            });

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
                    zoneEventsOld = zoneEvents;
        			zoneEvents = parseEvents(res.data);
        			return zoneEvents;
        		});
        }

        function parseEvents(data) {
            var combinedArray = [];
            angular.forEach(data, function(region,regionName){
                angular.forEach(region, function(eventArray) {
                    angular.forEach(eventArray, function(ev){

                        //to easily access the region when bulked into one array for ng-repeat
                        ev.region = regionName;
                        //order events appear from high level to low
                        ev.order = zones.order.indexOf(ev.zone.toString());
                        //unique identifier for each event 
                        ev.unid = ev.shard + ev.zone + ev.started;
                        //if previously tagged by controller
                        if (sessionTags[ev.unid]) {
                            ev.tagged = sessionTags[ev.unid];
                        }

                        combinedArray.push(ev);

                    });
                });
            });

            combinedArray.sort(eventSort);

            function eventSort(a,b) {
                return a.order - b.order;
            }

            return combinedArray;

        }

        function eventInterval() {
            eventsApiCall().then(function(res) {
                var actions = eventDiff(res);
                if(actions.added.length || actions.removed.length) {
                    console.log(actions);
                    notifyObservers();
                }
            });
        }

        function eventDiff(evArray) {
            var oldArray = zoneEventsOld;
            var newArray = evArray;
            var data = {
                added:[],
                removed:[]
            };

            //checking for removed items
            angular.forEach(oldArray, function(val) {
                if(newArray.map(function(e){return e.unid;}).indexOf(val.unid) === -1) {
                    data.removed.push(val);
                }
            });

            //checking for new items
            angular.forEach(newArray, function(val) {
                if (oldArray.map(function(e){return e.unid;}).indexOf(val.unid) === -1) {
                    data.added.push(val);
                }
            });

            return data;
        }

        function tag(id,val) {
            sessionTags[id] = val;
        }

        function registerObserver(callback) {
            observerCallbacks.push(callback);
        }

        function notifyObservers() {
            angular.forEach(observerCallbacks, function(callback) {
                callback();
            });
        }

        function init() {
            $interval(eventInterval, 15000);
        }

    }
})();