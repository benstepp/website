(function() {
	angular
		.module('HeaderCtrl',[])
		.controller('HeaderController', HeaderCtrl);

	function HeaderCtrl($scope, $rootScope) {
		var _this = this;

		this.titles = {
			'index':'website',
			'riftevents':'Rift Event Tracker',
			'killingfloor':'KF-MapProgress'
		};

		this.locales = {
			'English':'en-US',
			'French':'fr-FR',
			'German':'de-DE'
		};

		this.data = {
			region: 'US',
			language: 'English',
			locale: 'en'
		};

		//default to US region add cookie checking later
		this.changeRegion = function(region) {
			this.data.region = region;
			this.checkLocale();
		};

		this.changeLanguage = function(language) {
			this.data.language = language;
			this.data.locale = this.locales[language];
			this.checkLocale();
		};

		//check difference in time format for US vs GB
		this.checkLocale = function() {
			if (this.data.language === 'English'	&& this.data.region !== 'US') {
				this.data.locale = 'en-GB';
			}
			else if (this.data.language === 'English' ) {
				this.data.locale = 'en-US';
			}
		};

		$rootScope.$on('$stateChangeStart', 
			function (event, next, nextParams, current, currentParams) {
				_this.title = _this.titles[next.name];
				_this.url = next.name;
			});

	}

})();