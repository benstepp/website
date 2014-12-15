(function() {
    angular
        .module('bsStatWeightForm', [])
        .directive('bsStatWeightForm', ['$compile', bsStatWeightForm]);

        function bsStatWeightForm($compile){

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
                    '<div>',
                    '<div class="row">',
                        '<div class="small-30 medium-10 columns" ng-repeat="stat in statOrder.main[calling]">',
                        '<label>{{stat}}</label>',
                        '<input placeholder="{{default(stat)}}" ng-model="statWeights[stat]" />',
                        '</div>',
                        '<div class="small-30 medium-10 columns">',
                        '<label>Endurance</label>',
                        '<input placeholder="{{default(\'Endurance\')}}" ng-model="statWeights.Endurance" />',
                        '</div>',
                    '</div>',
                    '<div class="row" ng-show="(role ===\'dps\') && (calling === \'warrior\') || (calling === \'rogue\')">',
                        '<div class="small-30 medium-10 columns" ng-repeat="stat in statOrder.phys">',
                        '<label>{{stat}}</label>',
                        '<input placeholder="{{default(stat)}}" ng-model="statWeights[stat]" />',
                        '</div>',
                    '</div>',
                    '<div class="row" ng-show="(role ===\'dps\') && (calling === \'mage\') || (calling === \'cleric\')">',
                        '<div class="small-30 medium-10 columns" ng-repeat="stat in statOrder.spell">',
                        '<label>{{stat}}</label>',
                        '<input placeholder="{{default(stat)}}" ng-model="statWeights[stat]" />',
                        '</div>',
                    '</div>',
                    '<div class="row" ng-show="(role ===\'tank\')">',
                        '<div class="small-30 medium-10 columns" ng-repeat="stat in statOrder.tank">',
                        '<label>{{stat}}</label>',
                        '<input placeholder="{{default(stat)}}" ng-model="statWeights[stat]" />',
                        '</div>',
                    '</div>',
                    '</div>'
                ].join(''),

                link: function (scope, element, attrs) {
                    if (typeof scope.init === 'undefined') {
                        scope.init = true;
                    
                    scope.statOrder = {
                        main: {
                            mage:["Intelligence","Wisdom"],
                            cleric:["Wisdom","Intelligence"],
                            rogue:["Dexterity","Strength"],
                            warrior:["Strength","Dexterity"]
                        },
                        phys:["Attack Power", "Physical Crit","Crit Power"],
                        spell:["Spell Power", "Spell Critical Hit","Crit Power"],
                        tank:["Block","Dodge","Guard"]
                    };

                    scope.default = function(val) {

                       var defaults = {
                           mage: {
                                "Intelligence":1.02,
                                "Wisdom":0.48,
                                "Spell Power":1,
                                "Crit Power":1.3888,
                                "Spell Critical Hit":0.52,
                                "Guard": 0.8,
                                "Dodge": 0.2,
                                "Block": 0.6
                           },
                           cleric: {
                            "Intelligence":0.422,
                            "Wisdom":1.037,
                            "Spell Power":1,
                            "Crit Power":0.96,
                            "Spell Critical Hit":0.304,
                            "Guard": 0.8,
                            "Dodge": 0.2,
                            "Block": 0.6
                           },
                           rogue: {
                            "Strength":0.6,
                            "Dexterity":1.2,
                            "Attack Power":1,
                            "Crit Power":0.9,
                            "Physical Crit":0.4,
                            "Guard": 0.8,
                            "Dodge": 0.2,
                            "Block": 0.6
                           },
                           warrior: {
                            "Strength":1.192,
                            "Dexterity":0.468,
                            "Attack Power":1,
                            "Crit Power":0.944,
                            "Physical Crit":0.392,
                            "Guard": 0.8,
                            "Dodge": 0.2,
                            "Block": 0.6
                           }
                       } 

                       if (scope.role === 'tank' && val === 'Endurance') {
                            scope.statWeightDefaults[val] = 1;
                            return 1;
                       }   
                       else {
                        scope.statWeightDefaults[val] = defaults[scope.calling][val] || 0;
                        return defaults[scope.calling][val] || 0;
                       }

                    }


                    }
                }
        }

    }

})();