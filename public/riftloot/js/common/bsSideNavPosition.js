(function() {
    'use-strict';

    angular
        .module('bsSideNavPosition', [])
        .directive('bsSideNavPosition', ['$window', bsSideNavPosition]);

        function bsSideNavPosition($window){

            var directive = {
                restrict: 'EA',
                link: link
            };
            return directive;

            function link(scope, element, attrs) {

                var moveSideNav = function() {
                    var scrollDistance = $window.pageYOffset;
                    //make sure the top value is either positive or 0
                    var newTop = (scope.init - scrollDistance)>0 ? (scope.init - scrollDistance) : 0;
                    element.css({top:newTop+'px'});
                };

                var moveElement = function() {

                };

                //initialize if it hasn't been
                if (typeof scope.init === 'undefined') {
                    //gets the base height of 'top' css value for side-nav
                    scope.init = parseInt($window.getComputedStyle(element[0], null).top);

                    //make a copy of the entire element and put it in the left-side-nav incase of mobile
                    var newParent = angular.element($window.document.querySelector('.inner-wrap'));
                    newParent.append(element[0]);
                    

                    //push the footer if there is one present
                    if($window.document.getElementsByTagName('footer')[0]) {
                        var footer = angular.element($window.document.getElementsByTagName('footer')[0]);
                        footer.addClass('side-nav-push');
                    }

                    //add a watcher for scroll and resize events
                    angular.element($window).bind('resize',function() {
                        moveSideNav();
                    });

                    angular.element($window).bind('scroll',function() {
                        moveSideNav();
                    });

                }
            }

        }

})();