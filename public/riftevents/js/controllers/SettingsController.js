(function() {
    'use strict';

    angular
        .module('SettingsController',[])
        .controller('SettingsController', ['$scope',SettingsController]);

    function SettingsController($scope) {
        var _this = this;

        _this.data = {};
        _this.toggleRegion = toggleRegion;
        init();

        function toggleRegion(reg) {
        	console.log(_this.data.region[reg]);
        	angular.forEach(_this.data.region[reg].shard, function(v,k) {
        		_this.data.region[reg].shard[k] = _this.data.region[reg].act;
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