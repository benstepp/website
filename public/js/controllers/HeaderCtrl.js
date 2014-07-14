angular.module('HeaderCtrl',[]).controller('HeaderController', function($scope) {

	//default to US region add cookie checking later
	$scope.region = 'US';
	$scope.language = 'English';

	$scope.changeRegion = function(region) {
		$scope.region = region;
	};

	$scope.changeLanguage = function(language) {
		$scope.language = language;
	};

});