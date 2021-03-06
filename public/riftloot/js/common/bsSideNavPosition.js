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
                    var mobile = moveElement(); //boolean based on screen width

                    //the mobile version of the menu doesn't need to be moved vertically.
                    if (!mobile) {
                        //get the original top value if it hasn't been seen yet for large screens
                        if (typeof scope.topVal==='undefined') {
                            scope.topVal = parseInt($window.getComputedStyle(element[0], null).top);
                        }

                        var scrollDistance = $window.pageYOffset;
                        //make sure the top value is either positive or 0
                        var newTop = (scope.topVal - scrollDistance)>0 ? (scope.topVal - scrollDistance) : 0;
                        element.css({top:newTop+'px'});
                    }
                    //if it is mobile we remove inline style to fallback to the defined style in css
                    else {
                        element.removeAttr('style');
                    }

                }

                function moveElement() {
                    var mobileParent = angular.element($window.document.querySelector('.inner-wrap'));
                    var parent = angular.element(element[0]).parent();
                    var elem = angular.element(element[0]);
                    var mobile = ($window.innerWidth <= 1024);

                    //foundation medium down breakpoint
                    if (mobile && parent !== mobileParent) {
                        elem.addClass('left-off-canvas-menu');
                        mobileParent.append(elem);
                        return true;
                    }

                    //foundation large up 
                    else if (parent !== scope.parent) {
                        elem.removeClass('left-off-canvas-menu');
                        scope.parent.append(elem);
                        return false;
                    }

                    //if the parent is already set we still need to return something
                    else {
                        return (mobile);
                    }

                }

                //initialize if it hasn't been
                function init() {
                    //gets a reference for the original parent of the side bar
                    scope.parent = angular.element(element[0]).parent();

                    //run once to check for mobile screen size
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