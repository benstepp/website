(function() {
    angular
        .module('routeStyles', ['ui.router'])
        .directive('head', ['$rootScope','$compile', routeStyles]);

        function routeStyles($rootScope, $compile){
            return {
                restrict: 'E',
                link: function(scope, elem){
                    var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" >';
                    elem.append($compile(html)(scope));
                    scope.routeStyles = {};
                    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current, currentParams) {
                        if(current && current.views && current.css){
                            if(!Array.isArray(current.css)){
                                current.css = [current.css];
                            }
                            angular.forEach(current.css, function(sheet){
                                delete scope.routeStyles[sheet];
                            });
                        }
                        if(next && next.views && next.css){
                            if(!Array.isArray(next.css)){
                                next.css = [next.css];
                            }
                            angular.forEach(next.css, function(sheet){
                                scope.routeStyles[sheet] = sheet;
                            });
                        }
                    });
                }
            };
        }

})();