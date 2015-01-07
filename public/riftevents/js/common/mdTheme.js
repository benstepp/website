(function() {
    'use strict';

    angular
        .module('mdTheme',['ngMaterial'])
        .config(['$mdThemingProvider', mdTheme]);

    function mdTheme($mdThemingProvider) {

        $mdThemingProvider.theme('default')
            .primaryColor('deep-purple')
            .accentColor('teal');

    }
})();