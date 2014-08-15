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
				_this.fromState = fromState;

				//if there is a player object, the first player is the main player
				//bind this so the addfriend link works
				if (toParams.players) {
					_this.player = toParams.players.split(',')[0];
				}

				//if the toState is addfriends we need to save the fromParams
				if (toState.name === 'addfriends' && fromState.name !== '') {
					_this.params = fromParams;
				}

			});

		//if the from state is empty, default to comparemaps
		_this.getFromState = function() {
			if (_this.fromState.name === '') {
				return 'comparemaps';
			}
			else{
				return _this.fromState.name;
			}
		};

	}
	
})();