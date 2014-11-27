var validator = require('validator'),
	dropLocations = require('./config/dropLocations.js'),
	dropsByLocation = require('./dropsByLocation.js'),
	dropsByRole = require('./dropsByRole.js'),
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

				var locale = validator.toString(req.params.locale);
				var tier = validator.toString(req.params.tier);
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
	/*router.route('role/:calling/:role/:locale')
		.get(function(req,res) {
			var response = new dropsByRole(req.params.calling,req.params.role,req.params.locale)
				.then(function(jsonResponse) {
					res.json(jsonResponse);
				});
		});*/

	//
	//Catch all for bad API options
	//
	router.route('*')
		.get(function(req,res) {
			 res.json({error:validApiOptions.error});
		});

};				