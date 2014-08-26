(function() {
	angular
		.module('HeaderCtrl',['ui.router'])
		.controller('headerController', ['$scope', '$rootScope', '$location',headerController]);

	function headerController($scope, $rootScope, $location) {

		var _this = this;

		_this.locales = {
			'English':'en-US',
			'French':'fr-FR',
			'German':'de-DE'
		};

		//initialize data (use local storage later);
		_this.data = {
			region: 'US',
			language: 'English',
			locale: 'en-US'
		};

		_this.changeRegion = function(region) {
			this.data.region = region;
			this.checkLocale();
		};

		_this.changeLanguage = function(language) {
			this.data.language = language;
			this.data.locale = this.locales[language];
			this.checkLocale();
		};

		//check difference in time format for US vs GB
		_this.checkLocale = function() {
			if (this.data.language === 'English'	&& this.data.region !== 'US') {
				this.data.locale = 'en-GB';
			}
			else if (this.data.language === 'English' ) {
				this.data.locale = 'en-US';
			}
		};

	}
	
})();