var affixMap = {
	//Main stats
	'Dexterity': {
		text_en:'{+$} Dexterity',
		exclude:['Barbarian','Crusader','Wizard','Witch Doctor'],
		suffix_en:'of Pain'
	},
	'Intelligence': {
		text_en:'{+$} Intelligence',
		exclude:['Demon Hunter','Monk','Barbarian','Crusader'],
		suffix_en:'of Far Sight'
	},
	'Strength': {
		text_en:'{+$} Strength',
		exclude:['Demon Hunter','Monk','Wizard','Witch Doctor'],
		suffix_en:'of War'
	},
	'Vitality': {
		text_en:'{+$} Vitality',
		suffix_en:'of Glory'
	},

	//Defensive
	'AllResist': {
		text_en:'{+$} Resistance to All Elements',
		exclude:['PhysRes','ColdRes','FireRes','LightRes','ArcRes','PoisRes'],
		prefix_en:'Chromatic'
	},
	'PercLife': {
		text_en:'{+$%} Life',
		prefix_en:'Stalwart'
	},
	'Armor': {
		text_en:'{+$} Armor',
		suffix_en:'of the Castle'
	},
	'LifeRegen': {
		text_en:'Regenerates {$} Life per Second',
		prefix_en:'Undying'
	},

	//Elemental
	'PhysDamage': {
		text_en: 'Physical Skills deal {$%} more damage',
	},
	'ArcaneDamage': {
		text_en: 'Arcane Skills deal {$%} more damage',
		exclude:['Demon Hunter','Monk','Barbarian','Crusader','Witch Doctor']
	},
	'ColdDamage': {
		text_en: 'Cold Skills deal {$%} more damage',
		exclude:['Crusader']
	},
	'FireDamage': {
		text_en: 'Fire Skills deal {$%} more damage',
	},
	'PoisonDamage': {
		text_en: 'Poison Skills deal {$%} more damage',
		exclude:['Demon Hunter','Monk','Barbarian','Crusader','Wizard']
	},
	'HolyDamage': {
		text_en: 'Holy Skills deal {$%} more damage',
		exclude:['Demon Hunter','Barbarian','Wizard','Witch Doctor']
	},
	'LightningDamage': {
		text_en: 'Lightning Skills deal {$%} more damage',
		exclude:['Witch Doctor'],
		prefix_en:'Shocking'
	},

	//Offensive
	'CritDamage': {
		text_en:'Critical Hit Damage Increased by {$%}',
		prefix_en:'Deadly'
	},
	'CritChance': {
		text_en:'Critical Hit Chance Increased by {$%}',
		prefix_en:'Lacerating'
	},
	'AttackSpeed': {
		text_en:'Attack Speed Increased by {$%}',
		prefix_en:'Assailing'
	},
	'AvgDamage': {
		text_en:'{$} - {$} Damage',
	},

	//Utility
	'AreaDamage': {
		text_en:'Chance to Deal {$%} Area Damage on Hit.',
		prefix_en:'Inundating'
	},
	'CostReduc': {
		text_en:'Reduces All Resource Costs by {$%}',
		prefix_en:'Masterful'
	},
	'CdReduc': {
		text_en:'Reduces cooldown of all skills by {$%}.',
		prefix_en:'Insightful'
	},
	'LifePerHit': {
		text_en:'{+$} Life per Hit',
		suffix_en:'of Gore'
	},
	'Socket': {
		prefix_en:'Socketed'
	},

	//Secondary Resists
	'PhysRes': {
		text_en:'{+$} Physical Resistance',
		exclude:['AllRes','ColdRes','FireRes','LightRes','ArcRes','PoisRes'],
		prefix_en:'Hermetic'
	},
	'ColdRes': {
		text_en:'{+$} Cold Resistance',
		exclude:['AllRes','PhysRes','FireRes','LightRes','ArcRes','PoisRes'],
		prefix_en:'Sheltering'
	},
	'FireRes': {
		text_en:'{+$} Fire Resistance',
		exclude:['AllRes','PhysRes','ColdRes','LightRes','ArcRes','PoisRes'],
		prefix_en:'Charred'
	},
	'LightRes': {
		text_en:'{+$} Lightning Resistance',
		exclude:['AllRes','PhysRes','ColdRes','FireRes','ArcRes','PoisRes'],
		prefix_en:'Tranquil'
	},
	'ArcRes': {
		text_en:'{+$} Arcane Resistance',
		exclude:['AllRes','PhysRes','ColdRes','FireRes','LightRes','PoisRes'],
		prefix_en:'Beguiling'
	},
	'PoisRes': {
		text_en:'{+$} Poison Resistance',
		exclude:['AllRes','PhysRes','ColdRes','FireRes','LightRes','ArcRes'],
		prefix_en:'Untarnished'
	},
	'RangeReduc':{
		text_en:'Reduces damage from ranged attacks by {$%}',
	},
	'MeleeReduc': {
		text_en:'Reduces damage from melee attacks by {$%}',
		suffix_en:'of the Gladiator'
	},
	'GoldFind': {
		text_en:'{$%} Extra Gold from Monsters',
		prefix_en:'Prosperous'
	},
	'BonusXp': {
		text_en:'Monster kills grant{+$} experience.',
		prefix_en:'Restless'
	},
	'CcReduc': {
		text_en:'Reduces duration of control impairing effects by {$%}',
	},
	'BlindHit': {
		text_en:'{$%} Chance to Blind on Hit',
		prefix_en:'Perplexing'
	},
	'Globes': {
		text_en:'Health Globes and Potions Grant {+$} Life.',
		prefix_en:'Euphoric'
	},
	'Thorns': {
		text_en:'Ranged and melee attackers take {$} per hit',
		suffix_en:'of Razors'
	}


};

module.exports = affixMap;