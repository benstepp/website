var express = require('express');

module.exports = function(app, io) {

	//router
	var router = express.Router();
	app.use('/api/riftloot', router);

	//main routes
	require('./routes.js')(router);

};