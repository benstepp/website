var itemSlots = {
	cleric:[
	'Helmet',
	'Shoulders',
	'Cape',
	'Chest',
	'Gloves',
	'Belt',
	'Legs',
	'Feet',
	'Earring',
	'Neck',
	'Ring',
	'Seal',
	'Trinket',
	'One Handed',
	'Off Hand',
	'Two Handed',
	'Ranged',
	'Lesser Essence',
	'Greater Essence'
	],
	mage:[
	'Helmet',
	'Shoulders',
	'Cape',
	'Chest',
	'Gloves',
	'Belt',
	'Legs',
	'Feet',
	'Earring',
	'Neck',
	'Ring',
	'Seal',
	'Trinket',
	'Main Hand',
	'One Handed',
	'Off Hand',
	'Two Handed',
	'Ranged',
	'Lesser Essence',
	'Greater Essence'
	],
	rogue:[
	'Helmet',
	'Shoulders',
	'Cape',
	'Chest',
	'Gloves',
	'Belt',
	'Legs',
	'Feet',
	'Earring',
	'Neck',
	'Ring',
	'Seal',
	'Trinket',
	'One Handed',
	'Ranged',
	'Lesser Essence',
	'Greater Essence'
	],
	warrior:[
	'Helmet',
	'Shoulders',
	'Cape',
	'Chest',
	'Gloves',
	'Belt',
	'Legs',
	'Feet',
	'Earring',
	'Neck',
	'Ring',
	'Seal',
	'Trinket',
	'One Handed',
	'Off Hand',
	'Two Handed',
	'Ranged',
	'Lesser Essence',
	'Greater Essence'
	],
};

module.exports = itemSlots;

var itemSlots = {
	cleric:{
		dps:{
			main:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Off Hand','Two Handed','Ranged','Lesser Essence','Greater Essence'],
			offClass:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Off Hand','Two Handed','Ranged','Lesser Essence','Greater Essence']
		},
		tank:{
			main:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Off Hand','Two Handed','Ranged','Lesser Essence','Greater Essence'],
			offClass:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket','Ranged','Lesser Essence','Greater Essence']
		}
	},
	mage:{
		dps:{
			main:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Off Hand','Two Handed','Ranged','Lesser Essence','Greater Essence'],
			offClass:['Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Off Hand','Two Handed','Ranged','Lesser Essence','Greater Essence']
		},
		tank:{
			main:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Off Hand','Two Handed','Ranged','Lesser Essence','Greater Essence'],
			offClass:['Earring','Neck','Ring','Seal','Trinket','Ranged','Lesser Essence','Greater Essence']
		}
	},
	rogue:{
		dps:{
			main:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Off Hand','Ranged','Lesser Essence','Greater Essence'],
			offClass:['Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Ranged','Lesser Essence','Greater Essence']
		},
		tank:{
			main:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Off Hand','Ranged','Lesser Essence','Greater Essence'],
			offClass:['Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Ranged','Lesser Essence','Greater Essence']
		}
	},
	warrior:{
		dps:{
			main:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Off Hand','Two Handed','Ranged','Lesser Essence','Greater Essence'],
			offClass:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Off Hand','Ranged','Lesser Essence','Greater Essence']
		},
		tank:{
			main:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Off Hand','Two Handed','Ranged','Lesser Essence','Greater Essence'],
			offClass:['Helmet','Shoulders','Cape','Chest','Gloves','Belt','Legs','Feet','Earring','Neck','Ring','Seal','Trinket',['One Handed','Main Hand'],'Ranged','Lesser Essence','Greater Essence']
		}
	},
};