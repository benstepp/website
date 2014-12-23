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

                function moveSideNav() {
                    var mobile = moveElement();
                    if (!mobile) {
                        if (typeof scope.topVal==='undefined') {
                            scope.topVal = parseInt($window.getComputedStyle(element[0], null).top);
                        }

                        var scrollDistance = $window.pageYOffset;
                        //make sure the top value is either positive or 0
                        var newTop = (scope.topVal - scrollDistance)>0 ? (scope.topVal - scrollDistance) : 0;
                        element.css({top:newTop+'px'});
                    }

                }

                function moveElement() {
                    var mobileParent = angular.element($window.document.querySelector('.inner-wrap'));
                    var parent = angular.element(element[0]).parent();
                    var elem = angular.element(element[0]);

                    //foundation medium down breakpoint
                    if ($window.innerWidth <= 1024 && parent !== mobileParent) {
                        elem.addClass('left-off-canvas-menu');
                        mobileParent.append(elem);
                        return true;
                    }
                    else {
                        elem.removeClass('left-off-canvas-menu');
                        scope.parent.append(elem);
                        return false;
                    }

                }

                //initialize if it hasn't been
                function init() {
                    //gets the base height of 'top' css value for side-nav
                    scope.parent = angular.element(element[0]).parent();
                    moveSideNav();

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
                init();
            }

        }

})();