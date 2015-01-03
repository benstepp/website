(function() {
    'use strict';

    angular
        .module('AppDataService',[])
        .service('AppDataService', ['$window',AppDataService]);

    function AppDataService($window) {
    	var _this = this;
        
        //public methods
        _this.saveData = saveData;
        _this.retrieveData = retrieveData;
        _this.registerObserver = registerObserver;

        //private variables
        var riftEventsData = {
        	firstVisit:true,
        };
        var observerCallbacks = [];
        var supported;

        init();

        function saveData(key,val) {
        	riftEventsData[key] = val;
        	//save the data object to localStorage if it is supported
        	if (supported) {
        		localStorage.riftEventsData = angular.toJson(riftEventsData);
        	}
        	//notify the observers of change in application data
        	notifyObservers();
        }

        function retrieveData(key) {
        	return riftEventsData[key];
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
        	//Determine whether or not local storage is supported
        	//from github.com/agrublev/angularLocalStorage
        	//MIT Licence
			var storage = (typeof $window.localStorage === 'undefined') ? undefined : $window.localStorage;
			supported = (typeof storage !== 'undefined');
			if (supported) {
				var testKey = '__' + Math.round(Math.random() * 1e7);
				try {
					localStorage.setItem(testKey, testKey);
					localStorage.removeItem(testKey);
				}
				catch (err) {
					supported = false;
				}
			}

			//pull riftloot data or just use the default provided here
			if (supported) {
				var stored = angular.fromJson(localStorage.getItem("riftEventsData")) || {};

				//loop through the keys incase the user's localStorage is from an older app version
				var dataKeys = Object.keys(riftEventsData);
				angular.forEach(dataKeys, function(key) {
					riftEventsData[key] = stored[key] || riftEventsData[key];
				});
				//save the data object in case of version changes
				localStorage.riftEventsData = angular.toJson(riftEventsData);
			}

        }

    }
})();