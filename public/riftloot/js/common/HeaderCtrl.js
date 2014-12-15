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
			calling: 'warrior',
			role: 'dps',
			language: 'English',
			locale: 'en',
			tooltipExpanded: true
		};

		//capitalizes first letter of a string (for the nav titles)
		_this.cap = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		};

		_this.getCallingUrl = function(calling) {
			if (typeof _this.state !== 'undefined' ){
				if (_this.state.name === 'location') {
					return '#/' +_this.state.name +'/'+_this.data.tier+'/'+calling+'/'+_this.data.locale;
				}
				if(_this.state.name === 'role') {
					return '#/' +_this.state.name + '/' + calling + '/' + _this.data.role + '/' +_this.data.locale;
				}
				else {
					return "";
				}
			}
		};

		//Binds the header links URLs to hide navbar if on splash page
		$rootScope.$on('$stateChangeSuccess', 
			function(event, toState, toParams, fromState, fromParams) {
				_this.state = toState;
				if (toState.name === 'location') {
					_this.data.tier = toParams.tier;
					_this.data.calling = toParams.calling;
				}
				if (toState.name === 'role') {
					_this.data.calling = toParams.calling;
					_this.data.role = toParams.role;
				}
				if (toState.name !== '/') {
					_this.data.locale = toParams.locale;
					_this.data.language = languages[toParams.locale];
				}

			});

	}
	
})();