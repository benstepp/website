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
                language:'English',
                locale:'en',
                region:{
                    US:{
                        act:true,
                        shard: {
                            Seastone:true,
                            Greybriar:true,
                            Deepwood:true,
                            Wolfsbane:true,
                            Faeblight:true,
                            Laethys:true,
                            Hailol:true
                        }
                    },
                    EU:{
                        act:true,
                        shard: {
                            Bloodiron:true,
                            Gelidra:true,
                            Zaviel:true,
                            Brutwacht:true,
                            Brisesol:true
                        }
                    }
                },
                pvp:true,
                //zone _ids because I'm too lazy to set a promise for when zones come in then initialize service
                zone:{
                    12:true,
                    19:true,
                    1481781477:true,
                    27:true,
                    26580443:true,
                    20:true,
                    22:true,
                    24:true,
                    336995470:true,
                    6:true,
                    26:true,
                    1992854106:true,
                    479431687:true,
                    1770829751:true,
                    1494372221:true,
                    1967477725:true,
                    1213399942:true,
                    1446819710:true,
                    1300766935:true,
                    956914599:true,
                    798793247:true,
                    790513416:true,
                    282584906:true,
                    301:true,
                    302:true,
                    303:true
                },
                expansion: {
                    'Nightmare Tide':true,
                    'Storm Legion':true,
                    'Chocolate':true
                },
                perms: false,
                notify: false
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
            if (key){ return riftEventsData[key]; }
        	else { return riftEventsData;}
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

			//pull riftEvents data or just use the default provided here
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