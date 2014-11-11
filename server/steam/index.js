var express = require('express');

module.exports = function(app, io, _) {

	//Development only
	if (process.env.NODE_ENV == 'development') {
		require('../../dev/updatedb')(Zone, Event, db);
	}

	//router
	var router = express.Router();
	app.use('/api/steam',router);
	//main routes
	require('./routes.js')(router);

	//killing floor
	require('./appid/1250/routes.js')(router);

};