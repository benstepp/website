(function() {
    'use strict';

    angular
        .module('NotificationService',[])
        .service('NotificationService', NotificationService);

    function NotificationService() {
        var _this = this;

        _this.supported = ("Notification" in window);
        _this.requestPermission = requestPermission;
        _this.notify = notify;

        function requestPermission() {
        	//if supported and we haven't been denied yet
        	if (_this.supported && Notification.permission !== 'denied') {
        		Notification.requestPermission(function(perm) {
        			_this.permission = perm;
        		});
        	}
        }

        function notify() {
        	var notification = new Notification('test');

        }
    }
})();