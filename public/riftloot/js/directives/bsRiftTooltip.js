(function() {
    angular
        .module('bsRiftTooltip', [])
        .directive('bsRiftTooltip', bsRiftTooltip);

    function bsRiftTooltip() {
        return {
            restrict: 'A',
            transclude: true,
            replace:true,

            scope: {
                item:"=bsRiftTooltip"
            },

            template: ['<div class="rift-tooltip">',
                        '<div class="tooltip-name">{{item.name_de || item.name_en ||item.name_fr}}</div>',
                        '<div class="tooltip-bind">Bind on Pickup</div>',
                        '<span class="left">{{item.slot}}</span>',
                        '<span class="right">{{item.slot}}</span>',
                        '<div class="tooltip-hr"></div>',
                        '<div class="tooltip-stat" data-ng-repeat="(stat,bonus) in item.onEquip">{{stat}} +{{bonus}}</div>',
                '</div>'].join(''),

            link: function(scope, elem, attrs) {

            }

        };
    }
})();