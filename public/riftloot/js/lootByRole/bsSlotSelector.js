(function() {
    angular
        .module('bsSlotSelector', ['AppDataService'])
        .directive('bsSlotSelector', ['$compile', 'AppDataService',bsSlotSelector]);

        function bsSlotSelector($compile,AppDataService){

            return {
                restrict: 'A',
                replace:true,

                scope:{
                    slot:"=bsSlotSelector",
                    activateSlot:"&bsActivateSlot"
                },

                template:['<div>',
                '<div class="side-nav-link" ng-click="activateSlot()">',
                '{{slot}}',
                '</div>',
                '<div class="side-nav-divider"></div>',
                '</div>'].join(''),

                link: function (scope, element, attrs) {

                    scope.highlight = function() {
                        var elem = angular.element(element);
                        var activeSlot = AppDataService.retrieveData('slot');
                        if (activeSlot === scope.slot) {
                            elem.addClass('side-nav-selected');
                        }
                        else {
                            elem.removeClass('side-nav-selected');
                        }
                    };

                    AppDataService.registerObserver(scope.highlight);
                    scope.highlight();
                }

            };

        }

})();