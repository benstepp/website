var validator = require('validator'),
	validApiOptions = require('../../config/validApiOptions'),
	kfMaps = require('./kfMaps.json'),
	userSummary = require('../../users/userSummary.js'),
	KillingFloorStats = require('./KillingFloorStats.js');

module.exports = function(router) {

	router.use(function(req, res, next) {
		console.log("Router being used");
		next();
	});

	router.route('/userstats/:user')
		.get(function(req, res) {
			if (validator.isAlphanumeric(req.params.user)) {
				//get user summary
				var user = new userSummary(req.params.user, function(data) {
					res.json(data);
				});
			}
			else {
				res.json({error:validApiOptions.error});
			}

		});

	router.route('/1250/kfmaps')
		.get(function(req, res) {
			res.json(kfMaps);
		});

	router.route('/1250/userstats/:user')
		.get(function(req, res) {
			if (validator.isAlphanumeric(req.params.user)) {
				var stats = new KillingFloorStats(req.params.user, function(data) {
					res.json(data);
				});
			}
			else {
				res.json({error:validApiOptions.error});
			}
		});
};				