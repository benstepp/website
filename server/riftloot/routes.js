var dropLocations = require('./config/dropLocations.js'),
	dropsByLocation = require('./dropsByLocation.js');

module.exports = function(router) {

	router.use(function(req, res, next) {
		next();
	});

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
			var response = new dropsByLocation({raid:dropLocations.raid1},req.params.locale)
				.then(function(jsonResponse) {
					res.json(jsonResponse);
				});
		});


};				