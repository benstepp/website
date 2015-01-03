(function() {
    'use strict';

    angular
        .module('EventsService',[])
        .service('EventsService', ['$http','$q',EventsService]);

    function EventsService($http,$q) {
        var _this = this;

        _this.zoneEvents = {};
        _this.zones = {};
        _this.getZones = getZones;


        function getZones() {
        	var apiCallNeeded = Object.keys(_this.zones).length === 0;
        	return $q.when(apiCallNeeded ? zoneApiCall : _this.zones);
        }

        function zoneApiCall() {
        	return $http.get("api/riftevents/zones")
        		.then(function(res) {
        			return res.data;
        		});
        }

        getZones();
    }
})();