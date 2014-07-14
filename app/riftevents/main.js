//modules requires
var express = require('express');

//config
var db = require('./config/db');

module.exports = function(app, env) {

//database
var Events = require('./models/event');
var Zone = require('./models/zone');
//mongoose.connect(db.url);

//Development only configs
if (env == 'development') {
	var devRouter = express.Router();
	app.use('/dev',devRouter);
	require('../../dev/devroutes')(devRouter,Zone);
}


//login to rift mobile services
var trionAuth = require('./riftauth');
trionAuth.on('ready', function(tAuth) {
	//load up ZoneEvent class module with session cookies
	var ZoneEvent = require('./riftzoneevents');
	var zEvents = new ZoneEvent(tAuth);

	//create routes with our zoneevents class
	var router = express.Router();
	require('./routes')(router,Events, zEvents);
	app.use('/api/riftevents',router);

});

};