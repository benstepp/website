(function() {
	angular
		.module('kfFriendsCtrl',['KillingFloorService', 'SteamService', 'ui.router'])
		.controller('kfFriendsController', ['$scope', 'friends', 'players','KillingFloorService', 'SteamService', kfFriendsController]);

	function kfFriendsController($scope, friends, players, KillingFloorService, SteamService) {

		var _this = this;

		//array of friends
		_this.friends = [];
		//replace all friends with players if they exist
		angular.forEach(players, function(val,key) {
			friends[key] = val;
		});
		//pushes the friends sorted by key in service to array for DOM binding
		angular.forEach(friends, function(val,key) {
			_this.friends.push(val);
		});

		//if the player is on the fromParams, set that key to added
		var fromParams = $scope.header.params.players.split(',');
		angular.forEach(fromParams, function(val,key) {
			angular.forEach(_this.friends, function(value, index) {
				if (fromParams[key] === _this.friends[index].data.summary.steamid ||
					fromParams[key] === _this.friends[index].userinput) {
					_this.friends[index].added = true;
				}
			});
		});

		_this.manualAdd = function() {
			if (_this.add !== '') {
				var add = ',' + _this.add;
				$scope.header.params.players += add;
				_this.add = '';
			}
		};

		_this.addFriend = function(friend) {

			//if it is not already added
			if (!friend.added) {
				//adds a comma to the beginning of the steamid
				var add = ',' + friend.data.summary.steamid;
				//adds it to the header where the links will change
				$scope.header.params.players += add;

				//add a style to show that this player has been selected
				angular.forEach(_this.friends, function(val,ind) {
					if (_this.friends[ind].data.summary.steamid === friend.data.summary.steamid) {
						_this.friends[ind].added = true;
						_this.friends[ind].removed = false;
					}
				});
			}

		};

		_this.removeFriend = function(friend) {

			angular.forEach(_this.friends, function(val,ind) {
				if (_this.friends[ind].data.summary.steamid === friend.data.summary.steamid) {
					_this.friends[ind].added = false;
					_this.friends[ind].removed = true;
				}
			});

		};

	}
})();