(function() {
    'use strict';

    angular
        .module('NotificationService',['AppDataService'])
        .service('NotificationService', ['AppDataService','$q',NotificationService]);

    function NotificationService(AppDataService,$q) {
        var _this = this;

        _this.supported = ("Notification" in window);
        _this.requestPermission = requestPermission;
        _this.hasPermission = hasPermission;
        _this.notify = notify;

        function requestPermission() {
            var deferred = $q.defer();
        	//if supported and we haven't been denied yet
        	if (_this.supported && Notification.permission !== 'denied') {
        		Notification.requestPermission(function(perm) {
        			if (perm === 'granted') {
        				AppDataService.saveData('perms',true);
                        deferred.resolve(true);
        			}
        			_this.permission = perm;
                    deferred.resolve(false);
        		});
        	}
            return deferred.promise;

        }

        function hasPermission() {
            var deferred = $q.defer();
            //if we have had permission before request for it again
            if (AppDataService.retrieveData('perms')) {
                Notification.requestPermission(function(perm) {
                    if (perm === 'granted') {
                        AppDataService.saveData('perms',true);
                        deferred.resolve(true);
                    }
                    _this.permission = perm;
                    deferred.resolve(false);
                });
            }
            else {
                deferred.resolve(false);
            }
            return deferred.promise;
        }

        function notify(event,locale,zone) {
            if (event.toShow && _this.supported) {
                var name = event['name_'+locale];
                var text = zone + ' on ' + event.shard;
                var notification = new Notification(name,{body:text});
            }
        }

    }
})();