var userSummary = require('./users/userSummary.js'),
	userFriends = require('./users/userFriends.js');

module.exports = function(router) {

	router.use(function(req, res, next) {
		console.log("Router being used");
		next();
	});

	router.route('/userstats/:user')
		.get(function(req, res) {
			if (typeof req.params.user !== undefined) {
				//get user summary
				var user = new userSummary(req.params.user, function(data) {
					res.json(data);
				});

			}

		});

	router.route('/friends/:user')
		.get(function(req,res) {
			if (typeof req.param.user !== undefined) {
				var friends = new userFriends(req.params.user, function(data) {
					res.json(data);
				});
			}
		});

};				