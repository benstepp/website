//modules requires
var express = require('express');

//config
var db = require('./config/db');

module.exports = function(app, env) {

//database
var Events = require('./models/event');
var Zone = require('./models/zone');
//mongoose.connect(db.url);



//login to rift mobile services
var TrionAuth = require('./riftauth');
trionAuth = new TrionAuth();
trionAuth.on('ready', function(tAuth) {
	//load up ZoneEvent class module with session cookies
	var ZoneEvent = require('./riftzoneevents');
	var zEvents = new ZoneEvent(tAuth);

	//when new events, update router
	zEvents.on('newEvents', function(events) {
		console.log('new events');
	});
});

//routes
var router = express.Router();
var ZoneEvents = {};
require('./routes')(router,Events, ZoneEvents);
app.use('/api',router);

//Development only configs
if (env == 'development') {
	var devRouter = express.Router();
	app.use('/dev',devRouter);
	require('./dev/devroutes')(devRouter,Zone);
}

};