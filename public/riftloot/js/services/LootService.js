(function() {
	angular
		.module('LootService',[])
		.service('LootService',['$http', '$q', LootService]);

	function LootService($http, $q) {
		var _this = this;
		_this.loot = {};


		_this.getLoot = function(tier) {
	        var deferred = $q.defer();
	        
			var url = '/api/riftloot/' + tier + '/';
            $http.get(url)
	            .success(function(response) {
	            	deferred.resolve(response);
	            })
	            .error(function(response) {
	                deferred.reject();
	            });

	        return deferred.promise;
	    };
	}



})();