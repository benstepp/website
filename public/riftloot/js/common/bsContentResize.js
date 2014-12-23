(function() {
    angular
        .module('bsContentResize', [])
        .directive('bsContentResize', ['$window', '$rootScope',bsContentResize]);

        function bsContentResize($window, $scope, $rootScope){
            var directive = {
                restrict:'EA',
                link:link,
            };
            return directive;

            function link(scope, element, attrs) {

                var getUsedHeight = function() {
                	//start with a 0 height
                	var usedHeight = 0;

                	//get the height of the visible navigation bars
                	var children = $window.document.querySelector('.inner-wrap').childNodes;
                	for (var i = 0; i < children.length; i++) {
                		if (typeof children[i].offsetHeight !== 'undefined' && 
                			children[i].nodeName !== 'ASIDE' && 
                			children[i].className !== 'main-section') {
                			usedHeight += children[i].offsetHeight;
                		}
                		
                	}

                	//get the height of the footer
                	var footerHeight = $window.document.getElementsByTagName('footer')[0].offsetHeight;
                	usedHeight += footerHeight;

                	//return to resize function
                	return usedHeight;
                };

                var resizeContent = function() {
                	var total = $window.innerHeight;
                	var used = getUsedHeight();
                	var newHeight = total - used;
                	//current height of the main view
                	var currentHeight = element[0].offsetHeight;

                	//only resize if the height is less than the total
                	if (used + scope.defaultHeight < total) {
                		element.css({
                			height: newHeight + 'px'
                		});
                	}
                };

				//when the view is loaded remove the style
				scope.$on('$viewContentLoaded', function() {
					element.css({height:'auto'});

					//then watch for changes in the height of the content
					//this happens after first digest loop
                    //otherwise we get the height of a loaded dom with no bindings
					var onloadwatch = scope.$watch(function(){
						return element[0].offsetHeight;
					}, 

					//when the height is changed, calculate its new height
					function() {
						var children = element[0].childNodes;
						var height = 0;
						for (var i = 0; i < children.length; i ++) {
							if (typeof children[i].offsetHeight !== 'undefined'){
							height += children[i].offsetHeight;
						}
						}
						//set the defaultHeight to the height of combined child nodes
						scope.defaultHeight = height;

						//remove this watch function if content is not dynamic
                        //value of this directive when an attribute determines this
                        if (!element[0].attributes['bs-content-resize'].value) {
                            onloadwatch();
                        }
						//finally resize content based on new height
						resizeContent();
					});
				});

				//bind this function to the window resize event
                angular.element($window).bind('resize', function(){
                	resizeContent();
                });

            }


        }

})();