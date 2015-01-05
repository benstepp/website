(function() {
    'use strict';

    angular
        .module('sideNavController',['ngMaterial'])
        .controller('sideNavController', ['$scope','$mdSidenav','$window',sideNavController]);

    function sideNavController($scope, $mdSidenav, $window) {
        /*jshint validthis: true */
        var _this = this;

        _this.openLeftMenu = openLeftMenu;

        //private vars
        var isChrome;

        init();

        function openLeftMenu() {
            if (isChrome) {
                objectReplacer();
            }
        	$mdSidenav('left').toggle();
        }

        function objectReplacer() {
            //remove and replace all object tags because chrome bugs out and makes them disappear
            var objects = $window.document.getElementsByTagName('object');
            angular.forEach(objects, function(obj) {
                var object = angular.element(obj);
                var parent = object.parent();
                object.remove();
                parent.append(object);
            });
        }

        function init() {
            //determine if the browser is chrome
            var isChromium = window.chrome,
                vendorName = window.navigator.vendor;
            if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc.") {
                isChrome = true;

                angular.element($window).bind('resize',function() {
                    objectReplacer();
                });
            }
            
        }
    }
})();