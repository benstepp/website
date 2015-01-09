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
                    '<div ng-class="{expanded:expanded,\'not-expanded\':!expanded}" class="tooltip-name" ng-click="toggleTooltip();">{{ ::(item.name_de || item.name_en || item.name_fr) }}</div>',
                    '<div>',
                    '<div class="tooltip-bind tooltip-text">{{ ::item.bind | translate }}</div>',
                    '<span class="left tooltip-text">{{ ::item.slot | translate }}</span>',
                    '<span class="right tooltip-text">{{ ::(item.armorType || item.weaponType || "Accessory") | translate }}</span>',
                    '<div class="tooltip-hr"></div>',
                    '<div class="tooltip-text" ng-show="::(item.armor || false)"><span>{{ ::\'Armor\' | translate }}</span>: {{ ::(item.armor || false) }}</div>',
                    '<div class="tooltip-text" ng-repeat="(stat,bonus) in ::item.onEquip | getOrder:\'order\':false">{{ ::bonus.name | translate }} +{{ ::bonus.value }}</div>',
                    '<div class="tooltip-hr" ng-show="::(item.itemset_de ||item.itemset_en || item.itemset_fr || false)"></div>',
                    '<div class="tooltip-set" ng-show="::(item.itemset_de ||item.itemset_en || item.itemset_fr || false)">{{ ::(item.itemset_de || item.itemset_en || item.itemset_fr || false) }}</div>',
                    '<div class="tooltip-hr" ng-show="::(item.drop ||false)"></div>',
                    '<div class="tooltip-drop" ng-show="::(item.drop.instance || false)">{{ ::item.drop.boss }} in {{ ::item.drop.instance }}</div>',
                    '<div class="tooltip-drop" ng-show="::(item.drop.other || false)">{{ ::item.drop.other }}</div>',
                    '</div>',
                    '<div ng-transclude></div>',
                '</div>'].join(''),

            link: function(scope, elem, attrs) {
                //Toggle the visibility of the tooltip without watchers
                scope.toggleTooltip = function() {
                    var statBlock = angular.element(elem.children()[1]);
                    scope.expanded = !scope.expanded;
                    statBlock.toggleClass('ng-hide');
                };

                //foundation small down breakpoint
                var isMobile = ($window.innerWidth <= 640);

                //initialize the tooltip expanded status
                if (typeof scope.expanded === 'undefined') {
                    scope.expanded = !(scope.forceCollapse || isMobile);

                    //if mobile
                    if(!scope.expanded) {
                        scope.toggleTooltip();
                    }
                }

            }

        };
    }
})();