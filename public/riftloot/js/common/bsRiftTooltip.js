(function() {
    angular
        .module('bsRiftTooltip', [])
        .directive('bsRiftTooltip', ['$window',bsRiftTooltip]);

    function bsRiftTooltip($window) {
        return {
            restrict: 'A',
            transclude: true,
            replace:true,

            scope: {
                forceCollapse:"=bsForceCollapse",
                item:"=bsRiftTooltip"
            },

            template: ['<div class="rift-tooltip">',
                    '<div ng-class="{expanded:expanded,\'not-expanded\':!expanded}" class="tooltip-name" ng-click="toggleCollapse();">{{ ::(item.name_de || item.name_en || item.name_fr) }}</div>',
                    '<div ng-hide="expanded">',
                    '<div class="tooltip-bind tooltip-text">Bind on Pickup</div>',
                    '<span class="left tooltip-text">{{ ::item.slot }}</span>',
                    '<span class="right tooltip-text">{{ ::(item.armorType || item.weaponType || "Accessory") }}</span>',
                    '<div class="tooltip-hr"></div>',
                    '<div class="tooltip-text" ng-show="::(item.armor || false)">Armor: {{ ::(item.armor || false) }}</div>',
                    '<div class="tooltip-text" ng-repeat="(stat,bonus) in ::item.onEquip | getOrder:\'bonus.order\':false">{{ ::bonus.name }} +{{ ::bonus.value }}</div>',
                    '<div class="tooltip-hr" ng-show="::(item.itemset_de ||item.itemset_en || item.itemset_fr || false)"></div>',
                    '<div class="tooltip-set" ng-show="::(item.itemset_de ||item.itemset_en || item.itemset_fr || false)">{{ ::(item.itemset_de || item.itemset_en || item.itemset_fr || false) }}</div>',
                    '<div class="tooltip-hr" ng-show="::(item.drop ||false)"></div>',
                    '<div class="tooltip-drop" ng-show="::(item.drop || false)">{{ ::item.drop.boss }} in {{ ::item.drop.instance }}</div>',
                    '</div>',
                    '<div ng-transclude></div>',
                '</div>'].join(''),

            link: function(scope, elem, attrs) {
                //foundation small down breakpoint
                var isMobile = ($window.innerWidth <= 640);

                //initialize the tooltip expanded status
                if (typeof scope.expanded === 'undefined') {
                    scope.expanded = (isMobile || scope.forceCollapse) || false;
                }

                //toggles the visibility of the tooltip
                scope.toggleCollapse = function() {
                    scope.expanded = !scope.expanded;
                };

            }

        };
    }
})();