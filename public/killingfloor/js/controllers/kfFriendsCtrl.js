(function() {
	angular
		.module('kfFriendsCtrl',['KillingFloorService', 'SteamService', 'ui.router'])
		.controller('kfFriendsController', ['$scope', 'friends', 'KillingFloorService', 'SteamService', kfFriendsController]);

	function kfFriendsController($scope, friends, KillingFloorService, SteamService) {

		//array of friends
		$scope.friends = [];
		
		//pushes the friends sorted by key in service to array for DOM binding
		angular.forEach(friends, function(val,key) {
			$scope.friends.push(val);
		});

	}
})();