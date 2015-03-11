var chest = {
	slot_en:'Torso',
	type:{
		'Chest Armor':{
			name_en:'Ascended Armor',
			image:{
				'Demon Hunter':'//media.blizzard.com/d3/icons/items/large/chestarmor_208_demonhunter_male.png',
				'Monk':'//media.blizzard.com/d3/icons/items/large/chestarmor_208_monk_male.png',
				'Barbarian':'//media.blizzard.com/d3/icons/items/large/chestarmor_208_barbarian_male.png',
				'Crusader':'//media.blizzard.com/d3/icons/items/large/chestarmor_208_crusader_male.png',
				'Witch Doctor':'//media.blizzard.com/d3/icons/items/large/chestarmor_208_witchdoctor_male.png',
				'Wizard':'//media.blizzard.com/d3/icons/items/large/chestarmor_208_wizard_male.png'
			}
		},
		'Cloak': {
			name_en:'Ascended Cloak',
			image:{
				default:'//media.blizzard.com/d3/icons/items/large/cloak_206_demonhunter_male.png'
			},
			exclude:['Monk','Barbarian','Crusader','Witch Doctor','Wizard']
		}
	},
	primary:{},
	secondary:{}
};

module.exports = chest;