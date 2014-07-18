angular.module('MainCtrl',[])
	.controller('MainController',
		function($scope) {

			$scope.defaultbtn = "app-btn";

			$scope.apps = [
				{
					name:"Rift Event Tracker",
					desc: "A zone event tracker created for Rift using their mobile APIs.",
					href: "#/riftevents",
					btn:"Start App",
					css: "rift-btn"
				},
				{
					name:"KF-MapProgression",
					desc: "Compare the map progression of your friends when choosing a Killing Floor map to play",
					href: "",
					btn:"Coming Soon",
					css: "kf-btn"
				}


			];

		});