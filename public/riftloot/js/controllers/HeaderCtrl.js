(function() {
	angular
		.module('HeaderCtrl',['ui.router'])
		.controller('headerController', ['$scope', '$rootScope', '$location',headerController]);

	function headerController($scope, $rootScope, $location) {

		var _this = this;

		var languages = {
			de: 'German',
			en: 'English',
			fr: 'French'
		};

		//initialize data (use local storage later);
		_this.data = {
			loot: 'location',
			tier: 'expert',
			class: 'all',
			language: 'English',
			locale: 'en'
		};

		//capitalizes first letter of a string (for the nav titles)
		_this.cap = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		};

		//Binds the header links URLs to hide navbar if on splash page
		$rootScope.$on('$stateChangeSuccess', 
			function(event, toState, toParams, fromState, fromParams) {
				_this.state = toState;
				if (toState.name !== '/') {
					_this.data.tier = toParams.tier;
					_this.data.class = toParams.class;
					_this.data.locale = toParams.locale;
					_this.data.language = languages[toParams.locale];
				}
			});

	}
	
})();