(function() {
	angular
		.module('kfCompareCtrl',['KillingFloorService', 'SteamService', 'ui.router'])
		.controller('kfCompareController', ['$scope', 'kfMaps','players','KillingFloorService', 'SteamService', kfCompareController]);

	function kfCompareController($scope, kfMaps, players, KillingFloorService, SteamService) {
		
		var _this = this;

		//JSON of Killing Floor Maps if we are on mapcompare state
		if (kfMaps) {
			this.kfMaps = kfMaps;
		}

		//array of players to compare
		this.players = [];

		//pushes the players sorted by key in service to array for DOM binding
		angular.forEach(players, function(val,key) {
			_this.players.push(val);
		});

	}
})();