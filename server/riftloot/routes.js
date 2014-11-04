var riftloot = require('./models/item.js');
var _ = require('lodash');

module.exports = function(router) {

	router.use(function(req, res, next) {
		next();
	});

	router.route('/expert/')
		.get(function(req, res) {
			riftloot.find({"drop.tier":"expert"}, function(err, results) {
				if (err) {console.log(err);}
				res.json(results);
			});
		});


};				