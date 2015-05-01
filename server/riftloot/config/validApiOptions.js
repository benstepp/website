var validApiOptions = {
	//all routes
	locale:['de','en','fr'],

	//location routes
	tier:['all','expert','raid1','raid2'],

	//role routes
	calling:['cleric','mage','rogue','warrior'],
	role:['dps','tank'],

	//error message for invalid options
	error: 'Invalid API Options Provided.'
};

module.exports = validApiOptions;