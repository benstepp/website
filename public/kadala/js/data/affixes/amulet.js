var amulet = {
	name:'',
	image:{
		default:'//media.blizzard.com/d3/icons/items/large/amulet17_demonhunter_male.png',
	},
	slot:'Neck',

	primary:{
			//Main stats
			'Dexterity': {
				text_en:'{+$} Dexterity',
				minl:626,
				maxl:750,
				mina:825,
				maxa:1000,
				exclude:['Barbarian','Crusader','Wizard','Witch Doctor']
			},
			'Intelligence': {
				text_en:'{+$} Intelligence',
				minl:626,
				maxl:750,
				mina:825,
				maxa:1000,
				exclude:['Demon Hunter','Monk','Barbarian','Crusader']
			},
			'Strength': {
				text_en:'{+$} Strength',
				minl:626,
				maxl:750,
				mina:825,
				maxa:1000,
				exclude:['Demon Hunter','Monk','Wizard','Witch Doctor']
			},
			'Vitality': {
				text_en:'{+$} Vitality',
				minl:626,
				maxl:750,
				mina:825,
				maxa:1000
			},

			//Defensive
			'AllResist': {
				text_en:'{+$} Resistance to All Elements',
				minl:91,
				maxl:100,
				mina:110,
				maxa:130
			},
			'PercLife': {
				text_en:'{+$%} Life',
				min:14,
				max:18,
			},
			'Armor': {
				text_en:'{+$} Armor',
				minl:559,
				maxl:595,
				mina:654,
				maxa:775
			},
			'LifeRegen': {
				text_en:'Regenerates {$} Life per Second',
				minl:6448,
				maxl:7678,
				mina:8445,
				maxa:10000
			},

			//Elemental
			'PhysDamage': {
				text_en: 'Physical Skills deal {$%} more damage',
				min:15,
				max:20
			},
			'ArcaneDamage': {
				text_en: 'Arcane Skills deal {$%} more damage',
				min:15,
				max:20,
				exclude:['Demon Hunter','Monk','Barbarian','Crusader','Witch Doctor']
			},
			'ColdDamage': {
				text_en: 'Cold Skills deal {$%} more damage',
				min:15,
				max:20,
				exclude:['Crusader']
			},
			'FireDamage': {
				text_en: 'Fire Skills deal {$%} more damage',
				min:15,
				max:20
			},
			'PoisonDamage': {
				text_en: 'Poison Skills deal {$%} more damage',
				min:15,
				max:20,
				exclude:['Demon Hunter','Monk','Barbarian','Crusader','Wizard']
			},
			'HolyDamage': {
				text_en: 'Holy Skills deal {$%} more damage',
				min:15,
				max:20,
				exclude:['Demon Hunter','Barbarian','Wizard','Witch Doctor']
			},
			'LightningDamage': {
				text_en: 'Lightning Skills deal {$%} more damage',
				min:15,
				max:20,
				exclude:['Witch Doctor']
			},

			//Offensive
			'CritDamage': {
				text_en:'Critical Hit Damage Increased by {$%}',
				min:51,
				max:100
			},
			'CritChance': {
				text_en:'Critical Hit Chance Increased by {$%}',
				min:8,
				max:10
			},
			'AttackSpeed': {
				text_en:'Attack Speed Increased by {$%}',
				min:5,
				max:7
			},
			'AvgDamage': {
				text_en:'{$} - {$} Damage',
				minl:[60, 120],
				maxl:[80, 160],
				mina:[88, 168],
				maxa:[105, 210]
			},

			//Utility
			'AreaDamage': {
				text_en:'Chance to Deal {$%} Area Damage on Hit.',
				min:10,
				max:20
			},
			'CostReduc': {
				text_en:'Reduces All Resource Costs by {$%}',
				min:5,
				max:8
			},
			'CdReduc': {
				text_en:'Reduces cooldown of all skills by {$%}.',
				min:5,
				max:8
			},
			'LifePerHit': {
				text_en:'',
				minl:15474,
				maxl:18429,
				mina:20271,
				maxa:23950
			},
			'Socket': {

			}

		},
	secondary:{},



};


module.exports = amulet;