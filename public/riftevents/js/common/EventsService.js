(function() {
    'use strict';

    angular
        .module('EventsService',['NotificationService','AppDataService'])
        .service('EventsService', ['$http','$q','$interval','NotificationService','AppDataService',EventsService]);

    function EventsService($http,$q,$interval,NotificationService,AppDataService) {
        var _this = this;

        //public methods
        _this.getZones = getZones;
        _this.getEvents = getEvents;
        _this.registerObserver = registerObserver;
        _this.tag = tag;

        //private variables
        var zoneEventsOld;
        var zoneEvents = {};
        var zones = {};
        var observerCallbacks = [];
        var sessionTags = {};
        var data = AppDataService.retrieveData();

        init();

        function getZones() {
            //who needs promises and separate apis when you can just shove it here and cache it forever
            var zonesz = {zones:[{"_id":"12","name_en":"Silverwood","name_fr":"Bois d'Argent","name_de":"Silberwald"},{"_id":"19","name_en":"Freemarch","name_fr":"Libremarche","name_de":"Freimark"},{"_id":"1481781477","name_en":"Stonefield","name_fr":"Champ de pierre","name_de":"Steinfeld"},{"_id":"27","name_en":"Gloamwood","name_fr":"Bois du Crépuscule","name_de":"Dämmerwald"},{"_id":"26580443","name_en":"Scarlet Gorge","name_fr":"Gorges Écarlates","name_de":"Scharlachrote Schlucht"},{"_id":"20","name_en":"Scarwood Reach","name_fr":"Étendue de Bois Meurtris","name_de":"Wundwaldregion"},{"_id":"22","name_en":"Iron Pine Peak","name_fr":"Pic du Pin de fer","name_de":"Eisenkieferngipfel"},{"_id":"24","name_en":"Moonshade Highlands","name_fr":"Hautes-Terres d'Ombrelune","name_de":"Mondschattenberge"},{"_id":"336995470","name_en":"Droughtlands","name_fr":"Plaines Arides","name_de":"Ödlande"},{"_id":"6","name_en":"Shimmersand","name_fr":"Sable-chatoyant","name_de":"Schimmersand"},{"_id":"26","name_en":"Stillmoor","name_fr":"Mornelande","name_de":"Stillmoor"},{"_id":"1992854106","name_en":"Ember Isle","name_fr":"Île de Braise","name_de":"Glutinsel"},{"_id":"479431687","name_en":"Kingdom of Pelladane","name_fr":"Royaume de Pelladane","name_de":"Königreich Pelladane"},{"_id":"1770829751","name_en":"Cape Jule","name_fr":"Cap Yule","name_de":"Kap Jul"},{"_id":"1494372221","name_en":"Seratos","name_fr":"Serratos","name_de":"Seratos"},{"_id":"1967477725","name_en":"City Core","name_fr":"Cœur de la Cité","name_de":"Stadtkern"},{"_id":"1213399942","name_en":"Eastern Holdings","name_fr":"Fiefs de l'Orient","name_de":"Östliche Besitztümer"},{"_id":"1446819710","name_en":"Ardent Domain","name_fr":"Contrée Ardente","name_de":"Eiferer-Reich"},{"_id":"1300766935","name_en":"Kingsward","name_fr":"Protectorat du Roi","name_de":"Königszirkel"},{"_id":"956914599","name_en":"Morban","name_fr":"Morban","name_de":"Morban"},{"_id":"798793247","name_en":"Steppes of Infinity","name_fr":"Steppes de l'Infini","name_de":"Steppen der Unendlichkeit"},{"_id":"790513416","name_en":"Ashora","name_fr":"Ashora","name_de":"Ashora"},{"_id":"282584906","name_en":"The Dendrome","name_fr":"Le Rhizome","name_de":"Das Dendrom"},{"_id":"301","name_en":"Goboro Reef","name_fr":"Récif de Goboro","name_de":"Goboro-Riff"},{"_id":"302","name_en":"Draumheim","name_fr":"Draumheim","name_de":"Draumheim"},{"_id":"303","name_en":"Tarken Glacier","name_fr":"Glacier de Tarken","name_de":"Tarken-Gletscher"}]};
            var apiCallNeeded = Object.keys(zones).length === 0;
            return $q.when(apiCallNeeded ? zonesz : zones);
        }

        function parseZones(zonesFromServer) {
            //initialize zone reference with order and by _id
            var parsedZones = {};
            parsedZones.order = [];
            parsedZones.ref = {};

            //indexes of the start/end of each expansion
            parsedZones.count = {
                "Nightmare Tide":[0,2],
                "Storm Legion":[3,13],
                "Chocolate":[14,25]
            };

            angular.forEach(zonesFromServer, function(zone) {
                parsedZones.order.push(zone._id);
                parsedZones.ref[zone._id] = zone;
                //remove the unneeded _id key in the zone object
                delete parsedZones.ref[zone._id]._id;
            });

            //reverse the order of the zones so newest (higher level) content appears first
            parsedZones.order.reverse();

            //setting up easy access for the settings controller
            parsedZones.expansion = {};
            angular.forEach(parsedZones.count, function(val,key) {
                var indexes = parsedZones.count[key];
                var zonesForExpansion = parsedZones.order.slice(indexes[0],indexes[1]+1);
                
                angular.forEach(zonesForExpansion, function(val,key) {
                    zonesForExpansion[key] = parsedZones.ref[val];
                    zonesForExpansion[key]._id = val;
                });

                parsedZones.expansion[key] = zonesForExpansion;
            });

            return parsedZones;

        }

        //Gets the bulk events object from the server
        //This is called when first loading the app
        //Will use websockets if available otherwise
        function getEvents() {
        	var apiCallNeeded = Object.keys(zoneEvents).length === 0;
        	return $q.when(apiCallNeeded ? eventsApiCall() : zoneEvents);
        }

        function eventsApiCall() {
        	return $http.get("/api/riftevents/events")
        		.then(function(res) {
                    zoneEventsOld = zoneEvents;
        			zoneEvents = parseEvents(res.data);
        			return zoneEvents;
        		});
        }

        function parseEvents(data) {
            var combinedArray = [];
            angular.forEach(data, function(region,regionName){
                angular.forEach(region, function(eventArray) {
                    angular.forEach(eventArray, function(ev){

                        //to easily access the region when bulked into one array for ng-repeat
                        ev.region = regionName;
                        //order events appear from high level to low
                        ev.order = zones.order.indexOf(ev.zone.toString());
                        //unique identifier for each event 
                        ev.unid = ev.shard + ev.zone + ev.started;
                        //if previously tagged by controller
                        if (sessionTags[ev.unid]) {
                            ev.tagged = sessionTags[ev.unid];
                        }

                        combinedArray.push(ev);

                    });
                });
            });

            combinedArray.sort(eventSort);

            function eventSort(a,b) {
                return a.order - b.order;
            }

            return combinedArray;

        }

        function eventInterval() {
            eventsApiCall().then(function(res) {
                var actions = eventDiff(res);
                if(actions.added.length || actions.removed.length) {
                    notifyObservers();
                }
                angular.forEach(actions.added, function(val) {
                    showEvent(val);
                    if (data.notify) {
                        var zonetoPass = zones.ref[val.zone]['name_'+data.locale];
                        console.log(zonetoPass);
                        NotificationService.notify(val,data.locale,zonetoPass);
                    }
                });

            });
        }

        function showEvent(ev) {
            var checks = [];
            var toShow = true;

            //check if shard is to be shown (this covers region and pvp)
            checks.push(data.region[ev.region].shard[ev.shard]);
            //check if the zone is to be shown
            checks.push(data.zone[ev.zone]);

            //any false check (hide the event)
            angular.forEach(checks, function(check) {
                if (!check) {toShow = check;}
            });

            //otherwise show and save a reference for the more function
            ev.toShow = toShow;
        }

        function eventDiff(evArray) {
            var oldArray = zoneEventsOld;
            var newArray = evArray;
            var data = {
                added:[],
                removed:[]
            };

            //checking for removed items
            angular.forEach(oldArray, function(val) {
                if(newArray.map(function(e){return e.unid;}).indexOf(val.unid) === -1) {
                    data.removed.push(val);
                }
            });

            //checking for new items
            angular.forEach(newArray, function(val) {
                if (oldArray.map(function(e){return e.unid;}).indexOf(val.unid) === -1) {
                    data.added.push(val);
                }
            });

            return data;
        }

        function tag(id,val) {
            sessionTags[id] = val;
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
            $interval(eventInterval, 60000);
            //who needs promises and separate apis when you can just shove it here and cache it forever
            var zonesz = {zones:[{"_id":"12","name_en":"Silverwood","name_fr":"Bois d'Argent","name_de":"Silberwald"},{"_id":"19","name_en":"Freemarch","name_fr":"Libremarche","name_de":"Freimark"},{"_id":"1481781477","name_en":"Stonefield","name_fr":"Champ de pierre","name_de":"Steinfeld"},{"_id":"27","name_en":"Gloamwood","name_fr":"Bois du Crépuscule","name_de":"Dämmerwald"},{"_id":"26580443","name_en":"Scarlet Gorge","name_fr":"Gorges Écarlates","name_de":"Scharlachrote Schlucht"},{"_id":"20","name_en":"Scarwood Reach","name_fr":"Étendue de Bois Meurtris","name_de":"Wundwaldregion"},{"_id":"22","name_en":"Iron Pine Peak","name_fr":"Pic du Pin de fer","name_de":"Eisenkieferngipfel"},{"_id":"24","name_en":"Moonshade Highlands","name_fr":"Hautes-Terres d'Ombrelune","name_de":"Mondschattenberge"},{"_id":"336995470","name_en":"Droughtlands","name_fr":"Plaines Arides","name_de":"Ödlande"},{"_id":"6","name_en":"Shimmersand","name_fr":"Sable-chatoyant","name_de":"Schimmersand"},{"_id":"26","name_en":"Stillmoor","name_fr":"Mornelande","name_de":"Stillmoor"},{"_id":"1992854106","name_en":"Ember Isle","name_fr":"Île de Braise","name_de":"Glutinsel"},{"_id":"479431687","name_en":"Kingdom of Pelladane","name_fr":"Royaume de Pelladane","name_de":"Königreich Pelladane"},{"_id":"1770829751","name_en":"Cape Jule","name_fr":"Cap Yule","name_de":"Kap Jul"},{"_id":"1494372221","name_en":"Seratos","name_fr":"Serratos","name_de":"Seratos"},{"_id":"1967477725","name_en":"City Core","name_fr":"Cœur de la Cité","name_de":"Stadtkern"},{"_id":"1213399942","name_en":"Eastern Holdings","name_fr":"Fiefs de l'Orient","name_de":"Östliche Besitztümer"},{"_id":"1446819710","name_en":"Ardent Domain","name_fr":"Contrée Ardente","name_de":"Eiferer-Reich"},{"_id":"1300766935","name_en":"Kingsward","name_fr":"Protectorat du Roi","name_de":"Königszirkel"},{"_id":"956914599","name_en":"Morban","name_fr":"Morban","name_de":"Morban"},{"_id":"798793247","name_en":"Steppes of Infinity","name_fr":"Steppes de l'Infini","name_de":"Steppen der Unendlichkeit"},{"_id":"790513416","name_en":"Ashora","name_fr":"Ashora","name_de":"Ashora"},{"_id":"282584906","name_en":"The Dendrome","name_fr":"Le Rhizome","name_de":"Das Dendrom"},{"_id":"301","name_en":"Goboro Reef","name_fr":"Récif de Goboro","name_de":"Goboro-Riff"},{"_id":"302","name_en":"Draumheim","name_fr":"Draumheim","name_de":"Draumheim"},{"_id":"303","name_en":"Tarken Glacier","name_fr":"Glacier de Tarken","name_de":"Tarken-Gletscher"}]};
            zones = parseZones(zonesz.zones);
        }

    }
})();