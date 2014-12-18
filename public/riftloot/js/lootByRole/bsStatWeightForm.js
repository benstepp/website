(function() {
    angular
        .module('bsStatWeightForm', [])
        .directive('bsStatWeightForm', ['$compile', bsStatWeightForm]);

        function bsStatWeightForm($compile) {

            return {
                restrict: 'A',
                replace:true,

                scope:{
                    role:"=role",
                    calling:"=calling",
                    statWeights:"=statWeights",
                    statWeightDefaults:"=statWeightDefaults"
                },

                //holy fuck this is a pain in the ass to maintain
                template:[
                    '<div class="row">',
                        '<div class="small-30 columns">',
                            '<ul class="small-block-grid-1 medium-block-grid-2" ng-class="getGrid();">',
                            '<li ng-repeat="stat in stats">',
                            '<label>{{stat}}</label>',
                            '<input placeholder="{{default(stat)}}" ng-model="statWeights[stat]" />',
                            '</li>',
                            '</ul>',
                        '</div>',
                    '</div>'
                ].join(''),

                link: function (scope, element, attrs) {

                    var statOrder = {
                        main: {
                            mage:["Intelligence","Wisdom"],
                            cleric:["Wisdom","Intelligence"],
                            rogue:["Dexterity","Strength"],
                            warrior:["Strength","Dexterity"]
                        },
                        phys:["Attack Power", "Physical Crit","Crit Power"],
                        spell:["Spell Power", "Spell Critical Hit","Crit Power"],
                        tank:["Block","Dodge","Guard","Armor","Endurance"]
                    };

                    var getStats = function() {
                        var stats = [];
                        Array.prototype.push.apply(stats,statOrder.main[scope.calling]);
                        if (scope.role === 'dps' && (scope.calling === 'warrior' || scope.calling === 'rogue')) {
                            Array.prototype.push.apply(stats,statOrder.phys);
                        }
                        else if (scope.role === 'dps' && (scope.calling === 'cleric' || scope.calling === 'mage')) {
                            Array.prototype.push.apply(stats,statOrder.spell);
                        }
                        else if (scope.role === 'tank') {
                            Array.prototype.push.apply(stats,statOrder.tank);
                        }
                        scope.stats = stats;
                    };

                    if (typeof scope.init === 'undefined') {
                        scope.init = true;
                        getStats();
                        scope.statWeightDefaults = {};
                        scope.getGrid = function() {
                            return 'large-block-grid-'+scope.stats.length;
                        };

                        scope.default = function(val) {

                           var defaults = {
                               mage: {
                                    "Intelligence":1.02,
                                    "Wisdom":0.48,
                                    "Spell Power":1,
                                    "Crit Power":1.3888,
                                    "Spell Critical Hit":0.52,
                                    "Guard": 0.6,
                                    "Dodge": 0.2,
                                    "Block": 0.4,
                                    "Endurance":2,
                                    "Armor":0.02
                               },
                               cleric: {
                                "Intelligence":0.422,
                                "Wisdom":1.037,
                                "Spell Power":1,
                                "Crit Power":0.96,
                                "Spell Critical Hit":0.304,
                                "Guard": 0.6,
                                "Dodge": 0.2,
                                "Block": 0.4,
                                "Endurance":2,
                                "Armor":0.02
                               },
                               rogue: {
                                "Strength":0.6,
                                "Dexterity":1.2,
                                "Attack Power":1,
                                "Crit Power":0.9,
                                "Physical Crit":0.4,
                                "Guard": 0.6,
                                "Dodge": 0.2,
                                "Block": 0.4,
                                "Endurance":2,
                                "Armor":0.02
                               },
                               warrior: {
                                "Strength":1.192,
                                "Dexterity":0.468,
                                "Attack Power":1,
                                "Crit Power":0.944,
                                "Physical Crit":0.392,
                                "Guard": 0.6,
                                "Dodge": 0.2,
                                "Block": 0.4,
                                "Endurance":2,
                                "Armor":0.02
                               }
                           };

                            scope.statWeightDefaults[val] = defaults[scope.calling][val] || 0;
                            return defaults[scope.calling][val] || 0;


                        };


                    }
                }
            };

        }

})();