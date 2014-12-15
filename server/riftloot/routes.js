var validator = require('validator'),
	dropLocations = require('./db/dropLocations.js'),
	dropsByLocation = require('./drops/dropsByLocation.js'),
	dropsByRole = require('./drops/dropsByRole.js'),
	validApiOptions = require('./config/validApiOptions.js');

module.exports = function(router) {

	router.use(function(req, res, next) {
		next();
	});

	//
	//Drops By Location Routes
	//
	router.route('/location/:tier/:locale')
		.get(function(req,res) {
			if(validator.isAlpha(req.params.locale) && 
			validator.isIn(req.params.locale.toLowerCase(),validApiOptions.locale) &&
			validator.isAlphanumeric(req.params.tier) &&
			validator.isIn(req.params.tier.toLowerCase(),validApiOptions.tier)) {

				var locale = validator.toString(req.params.locale).toLowerCase();
				var tier = validator.toString(req.params.tier).toLowerCase();
				var drops = dropLocations;

				//if tier is specified send a different object
				if (tier !== 'all') {
					drops = {};
					drops[tier] = dropLocations[tier];
				}

				var response = dropsByLocation(drops,locale)
					.then(function(jsonResponse){
						res.json(jsonResponse);
					});

			}
			else {
				res.json({error:validApiOptions.error});
			}
		});


	//
	//Drops By Role
	//
	router.route('/role/:calling/:role/:locale')
		.get(function(req,res) {
			if(validator.isAlpha(req.params.calling) &&
			validator.isIn(req.params.calling.toLowerCase(),validApiOptions.calling) &&
			validator.isAlpha(req.params.role) &&
			validator.isIn(req.params.role.toLowerCase(),validApiOptions.role) &&
			validator.isAlpha(req.params.locale) &&
			validator.isIn(req.params.locale.toLowerCase(),validApiOptions.locale)) {

				var calling = validator.toString(req.params.calling).toLowerCase();
				var role = validator.toString(req.params.role).toLowerCase();
				var locale = validator.toString(req.params.locale).toLowerCase();

				var response = dropsByRole(calling,role,locale)
					.then(function(jsonResponse) {
						res.json(jsonResponse);
					});
			}
			else {
				res.json({error:validApiOptions.error});
			}
			
		});


	//
	//Catch all for bad API options
	//
	router.route('*')
		.get(function(req,res) {
			 res.json({error:validApiOptions.error});
		});

};				