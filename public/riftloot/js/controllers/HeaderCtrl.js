(function() {
	angular
		.module('HeaderCtrl',['ui.router'])
		.controller('headerController', ['$scope', '$rootScope', '$location',headerController]);

	function headerController($scope, $rootScope, $location) {

		var _this = this;

		//initialize data (use local storage later);
		_this.data = {
			tier: 'Expert',
			class: 'All',
			language: 'English',
			locale: 'en'
		};

	}
	
})();