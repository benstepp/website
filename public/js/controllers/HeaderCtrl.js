angular.module('HeaderCtrl',[]).controller('HeaderController', function($scope, $rootScope) {

	$scope.titles = {
		'index':'website',
		'riftevents':'Rift Event Tracker'
	};

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
		else if ($scope.data.language === 'English' ) {
			$scope.data.locale = 'en-US';
		}
	};

	$rootScope.$on('$stateChangeStart', 
		function (event, next, nextParams, current, currentParams) {
            $scope.title = $scope.titles[next.name];
            $scope.url = next.name;
        });

});