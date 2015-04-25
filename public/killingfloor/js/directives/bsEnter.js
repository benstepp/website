(function() {
	angular
		.module('bsEnter', [])
		.directive('bsEnter', bsEnter);

		function bsEnter(){
			return function (scope, element, attrs) {
				element.bind("keydown keypress", function (event) {
					if(event.which === 13) {
						scope.$apply(function (){
							scope.$eval(attrs.bsEnter);
						});

						event.preventDefault();
					}
				});
			};
		}

})();