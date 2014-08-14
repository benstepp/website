(function() {
	angular
		.module('routes',['ui.router', 'KillingFloorService', 'SteamService'])
		.config(['$stateProvider','$urlRouterProvider', routes]);

	function routes($stateProvider,$urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('/', {
			url:'/',
			views: {
				"main": { 
					templateUrl:'partials/input.html',
					controller:'KillingFloorController',
					controllerAs:'kf'
				}
			}
		}); 

		$stateProvider.state('comparemaps', {
			url:'/comparemaps/:players',
			views: {
				'main': {
					templateUrl: 'partials/comparemaps.html',
					controller: 'KillingFloorController',
					controllerAs: 'kf'
				}
			},
			resolve: {
				'players': function() {
					console.log($stateParams);
					var players = $stateParams.players;
					var deferred = $q.defer();
					var playersLength = players.length;

					var newPlayers = [];
					for (var i = 0; i < playersLength; i ++) {
						KillingFloorService.getPlayer(players[i])
							.then(playerCallback(player));
					}
					return deferred.promise;
				}
			}
		});


		var playerCallback = function(player) {
			return function() {
				newPlayers.push(player);
				//if all ajax calls are done, resolve promise
				if (newPlayers.length === playersLength) {
					deferred.resolve(newPlayers);
				}
			};
		};

		/*
		Add Friends State, takes a steamid or customURL as the parameter.

		*/
		$stateProvider.state('addfriends', {
			url:'/addfriends/:player',
			views: {
				'main': {
					templateUrl: 'partials/addfriends.html',
					controller: 'kfFriendsController'
				}
			},
			resolve: {
				SteamService: 'SteamService',
				friends: ['SteamService','$stateParams', function(SteamService, $stateParams) {
					return SteamService.getFriends($stateParams.player);
				}]
			}
		});

	}

})();