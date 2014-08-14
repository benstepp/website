(function() {
	angular
		.module('routes',['ui.router', 'KillingFloorService', 'SteamService'])
		.config(['$stateProvider','$urlRouterProvider', routes]);

	function routes($stateProvider,$urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		/*
		The input state
		*/
		$stateProvider.state('/', {
			url:'/',
			views: {
				"main": { 
					templateUrl:'partials/input.html',
					controller:'kfInputController',
					controllerAs:'input'
				}
			}
		}); 

		/*
		The Map comparison state, expects a comma delimited string of steamids.
		Resolves the map json file and player stats for every player.
		*/
		$stateProvider.state('comparemaps', {
			url:'/comparemaps/:players',
			views: {
				'main': {
					templateUrl: 'partials/comparemaps.html',
					controller: 'kfCompareController',
					controllerAs: 'comparemaps'
				}
			},
			resolve: {
				KillingFloorService: 'KillingFloorService',
				kfMaps: ['KillingFloorService', function(KillingFloorService) {
					return KillingFloorService.getMaps();
				}],
				players: ['KillingFloorService', '$stateParams', function(KillingFloorService, $stateParams) {
					return KillingFloorService.getPlayers($stateParams.players);
				}]
			}
		});

		/*
		The Stat comparison state, expects a comma delimited string of steamids
		*/
		$stateProvider.state('comparestats', {
			url:'/comparestats/:players',
			views: {
				'main': {
					templateUrl: 'partials/comparestats.html',
					controller: 'kfCompareController',
				}
			}
		});

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