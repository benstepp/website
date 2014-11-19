var dropLocations = require('./config/dropLocations.js'),
	dropsByLocation = require('./dropsByLocation.js'),
	dropsByRole = require('./dropsByRole.js');

module.exports = function(router) {

	router.use(function(req, res, next) {
		next();
	});

	//
	//Drops By Location Routes
	//
	router.route('/all/:locale')
		.get(function(req,res) {
			var response = new dropsByLocation(dropLocations,req.params.locale)
				.then(function(jsonResponse){
					res.json(jsonResponse);
				});
		});

	router.route('/expert/:locale')
		.get(function(req, res) {
			var response = new dropsByLocation({expert:dropLocations.expert},req.params.locale)
				.then(function(jsonResponse) {
					res.json(jsonResponse);
				});
		});

	router.route('/raid1/:locale')
		.get(function(req,res) {
			var response = new dropsByLocation({raid1:dropLocations.raid1},req.params.locale)
				.then(function(jsonResponse) {
					res.json(jsonResponse);
				});
		});

	//
	//Drops By Role
	//
	router.route('role/:calling/:role/:locale')
		.get(function(req,res) {
			var response = new dropsByRole(req.params.calling,req.params.role,req.params.locale)
				.then(function(jsonResponse) {
					res.json(jsonResponse);
				});
		});

};				