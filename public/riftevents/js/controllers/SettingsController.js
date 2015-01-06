(function() {
    'use strict';

    angular
        .module('SettingsController',[])
        .controller('SettingsController', ['$scope',SettingsController]);

    function SettingsController($scope) {
        var _this = this;

        _this.data = {};
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
        	//for both regions
        	angular.forEach(_this.data.region, function(v,k) {
        		if(_this.data.region[k].act) {
        			if (typeof v.shard.Seastone !== 'undefined') { v.shard.Seastone = _this.data.pvp;}
        			if (typeof v.shard.Bloodiron !== 'undefined') {v.shard.Bloodiron = _this.data.pvp;}
        		}
        	});
        }

        function init() {
        	//get from data service


        	//or init with defaults
        	var defaults = {
        		language:'English',
        		region:{
        			US:{
        				act:true,
        				shard: {
        					Seastone:true,
        					Greybriar:true,
        					Deepwood:true,
        					Wolfsbane:true,
        					Faeblight:true,
        					Laethys:true,
        					Hailol:true
        				}
        			},
        			EU:{
        				act:true,
        				shard: {
        					Bloodiron:true,
        					Gelidra:true,
        					Zaviel:true,
        					Brutwacht:true,
        					Brisesol:true
        				}
        			}
        		},
        		pvp:true
        	};
        	_this.data = defaults;
        }

    }
})();