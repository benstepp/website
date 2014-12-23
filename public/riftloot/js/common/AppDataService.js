(function() {
    'use strict';

    angular
        .module('AppDataService',[])
        .service('AppDataService', ['$window',AppDataService]);

    function AppDataService($window) {
    	var _this = this;
        
        _this.saveData = saveData;
        _this.retrieveData = retrieveData;
        _this.registerObserver = registerObserver;

        var riftlootData = {
        	locale:'en',
        	slot:'Helmet'
        };

        var observerCallbacks = [];
        var supported;

        function saveData(key,val) {
        	riftlootData[key] = val;
        	//save the data object to localStorage if it is supported
        	if (supported) {
        		localStorage.riftlootData = angular.toJson(riftlootData);
        	}
        	//notify the observers of change in application data
        	notifyObservers();
        }

        function retrieveData(key) {
        	return riftlootData[key];
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
			var storage = (typeof $window.localStorage === 'undefined') ? undefined : $window.localStorage;
			supported = (typeof storage !== 'undefined');
			//safari throws error in private browsing mode
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
				var stored = angular.fromJson(localStorage.getItem("riftlootData")) || {};

				//loop through the keys incase the user's localstorage is from an older app version
				var storedKeys = stored ? Object.keys(stored) : [];
				var dataKeys = Object.keys(riftlootData);
				angular.forEach(dataKeys, function(key) {
					riftlootData[key] = stored[key] || riftlootData[key];
				});
			}

        }

        init();
    }
})();