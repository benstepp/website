(function() {
    'use strict';

    angular
        .module('NotificationService',['AppDataService'])
        .service('NotificationService', ['AppDataService',NotificationService]);

    function NotificationService(AppDataService) {
        var _this = this;

        _this.supported = ("Notification" in window);
        _this.requestPermission = requestPermission;
        _this.notify = notify;

        init();

        function requestPermission() {
        	//if supported and we haven't been denied yet
        	if (_this.supported && Notification.permission !== 'denied') {
        		Notification.requestPermission(function(perm) {
        			if (perm === 'granted') {
        				AppDataService.saveData('perms',true);
        			}
        			_this.permission = perm;
        		});
        	}
        }

        function notify() {
        	var notification = new Notification('test');

        }

        function init() {
        	//if we have had permission before request for it again
        	if (AppDataService.retrieveData('perms')) {
        		requestPermission();
        	}
        }
    }
})();