(function() {
    angular
        .module('bsSideNavPosition', [])
        .directive('bsSideNavPosition', ['$window', bsSideNavPosition]);

        function bsSideNavPosition($window){

            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    var moveSideNav = function() {
                        var scrollDistance = $window.scrollY;
                        //make sure the top value is either positive or 0
                        var newTop = (scope.init - scrollDistance)>0 ? (scope.init - scrollDistance) : 0;
                        element.css({top:newTop+'px'});
                    };

                    //initialize if it hasn't been
                    if (typeof scope.init === 'undefined') {
                        //this is the height of the topbar-nav 
                        scope.init = element[0].offsetTop;

                    //add a watcher for scroll and resize events
                    angular.element($window).bind('resize',function() {
                        moveSideNav();
                    });

                    angular.element($window).bind('scroll',function() {
                        moveSideNav();
                    });

                    }
                }
            };

        }

})();