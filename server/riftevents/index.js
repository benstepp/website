//modules requires
var express = require('express');

module.exports = function(app, io) {

//database
var Event = require('./models/event');
var Zone = require('./models/zone');

//login to rift mobile services
var trionAuth = require('./riftauth');
trionAuth.on('ready', function(tAuth) {
	//load up ZoneEvent class module with session cookies
	var ZoneEvent = require('./ZoneEvent.js');
	var zEvents = new ZoneEvent(tAuth);

	//create routes with our zoneevents class
	var router = express.Router();
	require('./routes.js')(router,Event, zEvents);
	app.use('/api/riftevents',router);

	//socket io from zoneevent events
	io.sockets.on('connection', function(socket) { 
		require('./sockets.js')(zEvents, socket);
	});

});

};