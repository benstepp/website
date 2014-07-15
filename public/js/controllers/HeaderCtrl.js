angular.module('HeaderCtrl',[]).controller('HeaderController', function($scope) {

	$scope.locales = {
		'English':'en-US',
		'French':'fr-FR',
		'German':'de-DE'
	};

	$scope.data = {
		region: 'US',
		language: 'English',
		locale: 'en'
	};

	//default to US region add cookie checking later
	$scope.changeRegion = function(region) {
		$scope.data.region = region;
		$scope.checkLocale();
	};

	$scope.changeLanguage = function(language) {
		$scope.data.language = language;
		$scope.data.locale = $scope.locales[language];
		$scope.checkLocale();
	};

	//check difference in time format for US vs GB
	$scope.checkLocale = function() {
		if ($scope.data.language === 'English'	&& $scope.data.region !== 'US') {
			$scope.data.locale = 'en-GB';
		}
	};

});