var helm = {
	slot_en:'Head',

	type:{
		'Helm':{
			name_en:'Ascended Crown',
			image:{
				'Demon Hunter':'//media.blizzard.com/d3/icons/items/large/helm_208_demonhunter_male.png',
				'Monk':'//media.blizzard.com/d3/icons/items/large/helm_208_monk_male.png',
				'Barbarian':'//media.blizzard.com/d3/icons/items/large/helm_208_barbarian_male.png',
				'Crusader':'//media.blizzard.com/d3/icons/items/large/helm_208_crusader_male.png',
				'Witch Doctor':'//media.blizzard.com/d3/icons/items/large/helm_208_witchdoctor_male.png',
				'Wizard':'//media.blizzard.com/d3/icons/items/large/helm_208_wizard_male.png'
			},
		},
		'Spirit Stone':{
			name_en:'Ascended Stone',
			image:{
				default:'//media.blizzard.com/d3/icons/items/large/spiritstone_206_demonhunter_male.png'
			},
			exclude:['Demon Hunter','Barbarian','Crusader','Witch Doctor','Wizard']
		},
		'Voodoo Mask':{
			name_en:'Ascended Mask',
			image:{
				default:'//media.blizzard.com/d3/icons/items/large/voodoomask_206_demonhunter_male.png'
			},
			exclude:['Demon Hunter','Monk','Barbarian','Crusader','Wizard']
		},
		'Wizard Hat':{
			name_en:'Ascended Headpiece',
			image:{
				default:'//media.blizzard.com/d3/icons/items/large/wizardhat_206_demonhunter_male.png'
			},
			exclude:['Demon Hunter','Monk','Barbarian','Crusader','Witch Doctor']
		}
	},

	primary:{},
	secondary:{}

};

module.exports = helm;