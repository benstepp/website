var statOrder = {
	main: {
		Mage:["Intelligence","Wisdom"],
		Cleric:["Wisdom","Intelligence"],
		Rogue:["Dexterity","Strength"],
		Warrior:["Strength","Dexterity"]
	},
	end: ["Endurance"],
	def: ["Block","Guard","Dodge"],
	dps: ["Attack Power","Spell Power","Crit Power","Physical Crit","Spell Critical Hit"],
	res: ["Resist All"],
	hit: ["Hit"],

};

module.exports = statOrder;