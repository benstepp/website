(function() {
	angular
		.module('MainCtrl',[])
		.controller('MainController', ['$scope', MainCtrl]);

	function MainCtrl($scope) {

		$scope.defaultbtn = "app-btn";

		$scope.apps = [
			{
				name:"Rift Event Tracker",
				desc: "A zone event tracker created for Rift using their mobile APIs.",
				href: "#/riftevents",
				btn:"Get Started",
				css: "rift-btn"
			},
			{
				name:"KF-MapProgress",
				desc: "Compare the map progression of your friends when choosing a Killing Floor map to play",
				href: "#/killingfloor",
				btn:"Get Started",
				css: "kf-btn"
			}
		];

	}
})();