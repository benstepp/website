(function() {
    angular
        .module('bsCollapseDungeon', [])
        .directive('bsCollapseDungeon', ['$window','$compile', bsCollapseDungeon]);

        function bsCollapseDungeon($window, $compile){

            var directive = {
                restrict: 'EA',
                link:link
            };
            return directive;

            function link(scope, element, attrs) {

                //initialize if it hasn't been
                if (typeof scope.expanded === 'undefined') {
                    scope.expanded = true;

                    scope.toggleDungeon = function() {
                        scope.expanded = !scope.expanded;
                    };

                    //reference so we don't call the method more than once
                    var children = element.children();

                    //add an ng click directive to the entire h5 element
                    var h5 = angular.element(children[0]);
                    h5.attr('ng-click',"toggleDungeon();");
                    $compile(h5)(scope);

                    //add ng-show for all children that isn't h5
                    var childrenLength = children.length;
                    for(var i =1; i < childrenLength;i++) {
                        var elem = angular.element(children[i]);
                        elem.attr('ng-show', 'expanded');
                        $compile(elem)(scope);
                    }

                }
            }
            

        }

})();