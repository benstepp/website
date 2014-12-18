(function() {
    angular
        .module('bsSlotSelector', [])
        .directive('bsSlotSelector', ['$compile', bsSlotSelector]);

        function bsSlotSelector($compile){

            return {
                restrict: 'A',
                replace:true,

                scope:{
                    slot:"=bsSlotSelector",
                    activeSlot:"&bsActiveSlot"
                },

                template:['<div class="side-nav-link" ng-click="activeSlot()">',
                '{{slot}}',
                '</div>'].join(''),

                link: function (scope, element, attrs) {
                    if (typeof scope.selectSlot === 'undefined') {
                        scope.selectSlot = function() {
                            scope.selected = true;
                        };
                    }
                
                }
            };

        }

})();