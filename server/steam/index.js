var express = require('express');

module.exports = function(app, io) {

	//router
	var router = express.Router();
	app.use('/api/steam',router);
	//main routes
	require('./routes.js')(router);

	//killing floor
	require('./appid/1250/routes.js')(router);

};