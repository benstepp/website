angular.module('HeaderCtrl',[]).controller('HeaderController', function($scope) {

	//default to US region add cookie checking later
	$scope.region = 'US';

	$scope.changeRegion = function(region) {
		$scope.region = region;
	};

});