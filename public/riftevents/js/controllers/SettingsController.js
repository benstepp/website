(function() {
    'use strict';

    angular
        .module('SettingsController',['AppDataService'])
        .controller('SettingsController', ['$scope','AppDataService','zones',SettingsController]);

    function SettingsController($scope, AppDataService,zones) {
        var _this = this;

        _this.data = {};
        _this.zones = zones;
        _this.toggleRegion = toggleRegion;
        _this.togglePvp = togglePvp;

        init();

        function toggleRegion(reg) {
        	var pvpShards = ['Seastone','Bloodiron'];

        	angular.forEach(_this.data.region[reg].shard, function(v,k) {
        		//if pvp is enabled just toggle all shards
        		if (_this.data.pvp) {
        			_this.data.region[reg].shard[k] = _this.data.region[reg].act;
        		}
        		//if pvp is disabled only toggle shards that aren't pvp
        		else if (!_this.data.pvp && pvpShards.indexOf(k) === -1) {
        			_this.data.region[reg].shard[k] = _this.data.region[reg].act;
        		}
        	});
        }

        function togglePvp() {
        	angular.forEach(_this.data.region, function(v,k) {
        		//if the region is activated
        		if(_this.data.region[k].act) {
        			//set the pvp shard based on new value if it exists
        			if (typeof v.shard.Seastone !== 'undefined') { v.shard.Seastone = _this.data.pvp;}
        			if (typeof v.shard.Bloodiron !== 'undefined') {v.shard.Bloodiron = _this.data.pvp;}
        		}
        	});
        }

        function getShards() {
            console.log(zones);
        }
        getShards();
        function init() {
        	//get from data service
        	_this.data = AppDataService.retrieveData();

            //add watcher to data to save on user input
            $scope.$watch(function() {
                return _this.data;
            }, function(newV,oldV) {
                angular.forEach(_this.data, function(v,k) {
                    AppDataService.saveData(k,v);
                });
            },true);
        }

    }
})();