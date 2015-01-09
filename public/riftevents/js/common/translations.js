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
            ZONES:'Zonen'
        });

        $translateProvider.translations('fr', {
        	EVENTS:'événements',
        	SETTINGS:'Paramètres',
        	LANGUAGE:'Langue',
        	DESKTOP_NOTIFICATIONS:'Notifications de Bureau',
        	EXAMPLE_NOTIFICATION:'Par Exemple la Notification',
        	SHARDS:'Shards',
            ZONES:'Zones'
        });

        $translateProvider.translations('en', {
        	EVENTS:'Events',
        	SETTINGS:'Settings',
        	LANGUAGE:'Language',
        	DESKTOP_NOTIFICATIONS:'Desktop Notifications',
            NOT_SUPPORTED:'Your web browser does not support Web Notifications.',
            MORE_INFO:'Web Notification technology is currently experimental and only available in a few browsers. For more information about Web Notifications and its availability see: ',
        	EXAMPLE_NOTIFICATION:'Example Notification',
        	SHARDS:'Shards',
            ZONES:'Zones'
        });

        $translateProvider.fallbackLanguage('en');

    }
})();