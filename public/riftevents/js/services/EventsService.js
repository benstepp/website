(function() {
	angular
		.module('EventsService',[])
		.service('EventsService',['$http', '$q', EventsService]);

	function EventsService($http, $q) {
		var _this = this;
		this.zoneEvents = {};
		this.zones = {};

		this.getZones = function() {
			console.log('called');
			var deferred = $q.defer();

			//if (_this.zones !== false) {
			//	deferred.resolve(_this.zones);
			//}
			//else {
				$http.get("/api/riftevents/zones")
					.success(function(zones) {
						var unpackedZones = {};
						angular.forEach(zones, function(zone,key) {
							var _id = zone._id;
							delete zone._id;
							unpackedZones[_id] = zone;
						});
						deferred.resolve(unpackedZones);
					});
			//}

			return deferred.promise;
		};

		this.getEvents = function(region) {

			//if region is specified change the url
			var url = '/api/riftevents/';
			if (region !== undefined) {
				url = '/api/riftevents/'+ region;
			}
			var deferred = $q.defer();
			$http.get(url).success(
				function(res) {
					if (region !== undefined) {
						_this.zoneEvents[region] = res;
					}
					else {
						_this.zoneEvents = res;
					}
					deferred.resolve(_this.zoneEvents);
				});
			return deferred.promise;
		};

		this.checkUpdated = function() {
			var url = '/api/riftevents/lastUpdated';
				var deferred = $q.defer();
					$http.get(url).success(
						function(res) {
							//check old lastupdated with new one
							if (res.message !== this.zoneEvents.lastUpdated) {
								deferred.resolve(true);
							}
							else {
								deferred.resolve(false);
							}
						});
					return deferred.promise;
		};

	}

})();