var drops = require();

module.exports = function(router) {

	router.use(function(req, res, next) {
		next();
	});

	router.route('/experts')
		.get(function(req, res) {


		});


};				