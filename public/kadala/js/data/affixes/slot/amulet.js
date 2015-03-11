var amulet = {
	slot_en:'Neck',

	type:{
		'Amulet':{
			name_en:'Amulet',
			image:{
				default:'//media.blizzard.com/d3/icons/items/large/amulet17_demonhunter_male.png',
			}
		}
	},

	primary:{
		//Main stats
		'Dexterity': {
			min:525,
			max:625,
			minl:626,
			maxl:750,
			mina:825,
			maxa:1000
		},
		'Intelligence': {
			min:525,
			max:625,
			minl:626,
			maxl:750,
			mina:825,
			maxa:1000
		},
		'Strength': {
			min:625,
			max:625,
			minl:626,
			maxl:750,
			mina:825,
			maxa:1000
		},
		'Vitality': {
			min:525,
			max:625,
			minl:626,
			maxl:750,
			mina:825,
			maxa:1000
		},

		//Defensive
		'AllResist': {
			min:86,
			max:90,
			minl:91,
			maxl:100,
			mina:110,
			maxa:130
		},
		'PercLife': {
			min:12,
			max:16,
			minl:14,
			maxl:18
		},
		'Armor': {
			min:509,
			max:545,
			minl:559,
			maxl:595,
			mina:654,
			maxa:775
		},
		'LifeRegen': {
			min:3824,
			max:6447,
			minl:6448,
			maxl:7678,
			mina:8445,
			maxa:10000
		},

		//Elemental
		'PhysDamage': {
			min:10,
			max:15,
			minl:15,
			maxl:20
		},
		'ArcaneDamage': {
			min:10,
			max:15,
			minl:15,
			maxl:20
		},
		'ColdDamage': {
			min:10,
			max:15,
			minl:15,
			maxl:20
		},
		'FireDamage': {
			min:10,
			max:15,
			minl:15,
			maxl:20
		},
		'PoisonDamage': {
			min:10,
			max:15,
			minl:15,
			maxl:20
		},
		'HolyDamage': {
			min:10,
			max:15,
			minl:15,
			maxl:20
		},
		'LightningDamage': {
			min:10,
			max:15,
			minl:15,
			maxl:20
		},

		//Offensive
		'CritDamage': {
			min:51,
			max:100
		},
		'CritChance': {
			min:7,
			max:10,
			minl:8,
			maxl:10
		},
		'AttackSpeed': {
			min:5,
			max:6,
			minl:5,
			maxl:7
		},
		'AvgDamage': {
			min:[40, 80],
			max:[60, 120],
			minl:[60, 120],
			maxl:[80, 160],
			mina:[88, 168],
			maxa:[105, 210]
		},

		//Utility
		'AreaDamage': {
			min:10,
			max:16,
			minl:10,
			maxl:20
		},
		'CostReduc': {
			min:5,
			max:7,
			minl:5,
			maxl:8
		},
		'CdReduc': {
			min:4,
			max:7,
			minl:5,
			maxl:8
		},
		'LifePerHit': {
			min:6823,
			max:15473,
			minl:15474,
			maxl:18429,
			mina:20271,
			maxa:23950
		},
		'Socket': {

		}

	},
	secondary:{
		'PhysRes': {
			min:121,
			max:140
		},
		'ColdRes': {
			min:121,
			max:140
		},
		'FireRes': {
			min:121,
			max:140
		},
		'LightRes': {
			min:121,
			max:140
		},
		'ArcRes': {
			min:121,
			max:140
		},
		'PoisRes': {
			min:121,
			max:140
		},
		'RangeReduc':{
			min:5,
			max:6
		},
		'MeleeReduc': {
			min:5,
			max:6
		},
		'GoldFind': {
			min:61,
			max:70
		},
		'BonusXp': {
			min:100,
			max:139
		},
		'CcReduc': {
			min:10,
			max:30
		},
		'BlindHit': {
			min:1,
			max:4.5
		},
		'Globes': {
			min:14231,
			max:20000
		},
		'Thorns': {
			min:2349,
			max:3180
		}
	},



};


module.exports = amulet;