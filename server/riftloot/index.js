var express = require('express');

module.exports = function(app, io, _) {

	//router
	var router = express.Router();
	app.use('/api/riftloot', router, _);

	//main routes
	require('./routes.js')(router);

};