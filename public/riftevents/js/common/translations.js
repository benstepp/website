(function() {
    'use strict';

    angular
        .module('translations',['pascalprecht.translate'])
        .config(['$translateProvider',translations]);

    function translations($translateProvider) {
        $translateProvider.translations('de', {
        	EVENTS:'Geschehen',
        	SETTINGS:'Einstellungen',
        	LANGUAGE:'Sprache',
        	DESKTOP_NOTIFICATIONS:'Desktop-Benachrichtigungen',
        	EXAMPLE_NOTIFICATION:'Beispiel Benachrichtigung',
        	SHARDS:'Shards',
        });

        $translateProvider.translations('fr', {
        	EVENTS:'événements',
        	SETTINGS:'Paramètres',
        	LANGUAGE:'Langue',
        	DESKTOP_NOTIFICATIONS:'Notifications de Bureau',
        	EXAMPLE_NOTIFICATION:'Par Exemple la Notification',
        	SHARDS:'Shards',
        });

        $translateProvider.translations('en', {
        	EVENTS:'Events',
        	SETTINGS:'Settings',
        	LANGUAGE:'Language',
        	DESKTOP_NOTIFICATIONS:'Desktop Notifications',
        	EXAMPLE_NOTIFICATION:'Example Notification',
        	SHARDS:'Shards',
        });

        $translateProvider.preferredLanguage('en');
    }
})();