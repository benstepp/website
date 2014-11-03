var drops = require('./drops.js').then(function(data) {
	drops = data;
});

module.exports = function(router) {

	router.use(function(req, res, next) {
		next();
	});

	router.route('/expert/:lang')
		.get(function(req, res) {
			res.json(drops[req.params.lang].expert);
		});


};				