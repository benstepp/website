(function() {
	angular
		.module('headerCtrl',['ui.router'])
		.controller('headerController', ['$scope', '$rootScope', '$location',headerController]);

	function headerController($scope, $rootScope, $location) {

		var _this = this;

		//Binds the header links URLs to include the correct players
		$rootScope.$on('$stateChangeSuccess', 
			function(event, toState, toParams, fromState, fromParams) {
				_this.params = toParams;

				//if there is a player object, the first player is the main player
				//bind this so the addfriend link works
				if (toParams.players) {
					_this.player = toParams.players.split(',')[0];
				}

				//if the toState is addfriends we need to save the fromParams
				if (toState.name === 'addfriends') {
					_this.params = fromParams;
				}

			});



	}
	
})();