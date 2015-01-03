(function() {
    'use strict';

    angular
        .module('sideNavController',['ngMaterial'])
        .controller('sideNavController', ['$scope','$mdSidenav',sideNavController]);

    function sideNavController($scope, $mdSidenav) {
        /*jshint validthis: true */
        var _this = this;

        _this.openLeftMenu = openLeftMenu;
        init();

        function openLeftMenu() {
        	$mdSidenav('left').toggle();
        }

        function init() {

        }
    }
})();