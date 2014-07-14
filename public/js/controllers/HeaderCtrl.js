angular.module('HeaderCtrl',[]).controller('HeaderController', function($scope) {

	$scope.locales = {
		'English':'en',
		'French':'fr',
		'German':'de'
	};

	$scope.data = {
		region: 'US',
		language: 'English',
		locale: 'en'
	};

	//default to US region add cookie checking later
	$scope.changeRegion = function(region) {
		$scope.data.region = region;
	};

	$scope.changeLanguage = function(language) {
		$scope.data.language = language;
		$scope.data.locale = $scope.locales[language];
	};

});