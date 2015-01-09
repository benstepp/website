(function() {
    'use strict';

    angular
        .module('translations',['pascalprecht.translate'])
        .config(['$translateProvider',translations]);

    function translations($translateProvider) {

        $translateProvider.translations('de', {
            "Armor":'Rüstung',
            "Endurance":'Ausdauer',

            "Dexterity":'Geschicklichkeit',
            "Intelligence":'Intelligenz',
            "Strength":'Stärke',
            "Wisdom":'Weisheit',

            "Guard":'Schutz',
            "Dodge":'Ausweichen',
            "Block":'Blocken',

            "Spell Critical Hit":'Zaubertreffer',
            "Spell Power":'Allen widerstehen',
            "Physical Crit":'Körperl. Krit',
            "Attack Power":'Angriffskraft',
            "Crit Power":'Kritische Kraft',

            "Hit":'Treffer',

            "Resist All":'Allen widerstehen',
            "Air Resist":'Luftwiderstand',
            "Death Resist":'Todeswiderstand',
            "Earth Resist":'Erdwiderstand',
            "Fire Resist":'Feuerwiderstand',
            "Life Resist":'Lebenswiderstand',
            "Water Resist":'Wasserwiderstand',

            "Chain":'Kette',
            "Cloth":'Stoff',
            "Leather":'Leder',
            "Plate":'Plattenrüstung',

            "Helmet":'Helm',
            "Shoulders":'Schultern',
            "Cape":'Umhang',
            "Chest":'Gürtel',
            "Gloves":'Handschuhe',
            "Belt":'Gürtel',
            "Legs":'Beine',
            "Feet":'Füße',
            "Earring":'Ohrring',
            "Neck":'Hals',
            "Ring":'Ring',
            "Seal":'Siegel',
            "Trinket":'Schmuckstück',
            "One Handed":'Einhand',
            "Off Hand":'Nebenhand',
            "Two Handed":'Zweihändig',
            "Ranged":'Fernkampf',
            "Greater Essence":'Stark',
            "Lesser Essence":'Schwach',

            "Cleric":'Kleriker',
            "Mage":'Magier',
            "Rogue":'Schurke',
            "Warrior":'Krieger',

            "Accessory":'Zubehör',
            "Air Wand":'Luftstab',
            "Bow":'Bogen',
            "Gun":'Schusswaffe',
            "Hammer":'Hammer',
            "Shield":'Schild',
            "Staff":'Stab',
            "Sword":'Schwert',
            "Two Handed Axe":'Zweihandaxt',
            "Two Handed Sword":'Zweihandschwert',
            "Wand":'Stab',
            "Water Wand":'Wasserstab',
            
            "All":'',
            "Language":'',
            "Calling":''
        });

        $translateProvider.translations('fr', {
            "Armor":'Armure',
            "Endurance":'Endurance',

            "Dexterity":'Dextérité',
            "Intelligence":'Intelligence',
            "Strength":'Force',
            "Wisdom":'Sagesse',

            "Guard":'Garde',
            "Dodge":'Esquive',
            "Block":'Blocage',

            "Spell Critical Hit":'Sort critique',
            "Spell Power":'Puissance des sorts',
            "Physical Crit":'Coup critique',
            "Attack Power":'Puissance d\'attaque',
            "Crit Power":'Puissance critique',

            "Hit":'Précision',

            "Resist All":'Toutes les résistances',
            "Air Resist":'Résistance aux dégâts d\'Air ',
            "Death Resist":'Résistance à la Mort',
            "Earth Resist":'Résistance aux dégâts de Terre',
            "Fire Resist":'Résistance aux dégâts de Feu',
            "Life Resist":'Résistance aux dégâts de Vie',
            "Water Resist":'Résistance aux dégâts d\'Eau',

            "Chain":'Armure de mailles',
            "Cloth":'Étoffe',
            "Leather":'Cuir',
            "Plate":'Armure de plates',

            "Helmet":'Tête',
            "Shoulders":'Épaules',
            "Cape":'Cape',
            "Chest":'Taille',
            "Gloves":'Mains',
            "Belt":'Taille',
            "Legs":'Jambes',
            "Feet":'Pieds',
            "Earring":'Boucle d\'oreille',
            "Neck":'Cou',
            "Ring":'Anneau',
            "Seal":'Sceau',
            "Trinket":'Talisman',
            "One Handed":'Une main',
            "Off Hand":'Main secondaire',
            "Two Handed":'À deux mains',
            "Ranged":'À distance',
            "Greater Essence":'Supérieur',
            "Lesser Essence":'Inférieure',

            "Cleric":'Clerc',
            "Mage":'Mage',
            "Rogue":'Voleur',
            "Warrior":'Guerrier',

            "Accessory":'Accessoire',
            "Air Wand":'Baguette de l\'Air',
            "Bow":'Arc',
            "Gun":'Arme à feu',
            "Hammer":'Marteau',
            "Shield":'Bouclier',
            "Staff":'Bâton',
            "Sword":'Épée',
            "Two Handed Axe":'Hache à deux mains',
            "Two Handed Sword":'Épée à deux mains',
            "Wand":'Baguette',
            "Water Wand":'Baguette de l\'Eau',

            "All":'',
            "Language":'',
            "Calling":''
        });

        $translateProvider.translations('en', {
            //leave it blank, all the keys are ones we want to use already
        });

        $translateProvider.fallbackLanguage('en');

    }
})();