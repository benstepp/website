var validator = require('validator'),
	validApiOptions = require('./config/validApiOptions'),
	userSummary = require('./users/userSummary.js'),
	userFriends = require('./users/userFriends.js');

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

	router.route('/friends/:user')
		.get(function(req,res) {
			if (validator.isAlphanumeric(req.params.user)) {
				var friends = new userFriends(req.params.user, function(data) {
					res.json(data);
				});
			}
			else {
				res.json({error:validApiOptions.error});
			}
		});

};				