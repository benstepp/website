//modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var socketio = require('socket.io');
var http = require('http');

//config
var db = require('./config/db');
var account = require('./config/account');
var port = process.env.PORT || 80;
var env = process.env.NODE_ENV || 'development';

//Execute app
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(morgan());

var server = http.Server(app);
var io = socketio(server);

//database
var Events = require('./app/models/event');
var Zone = require('./app/models/zone');
//mongoose.connect(db.url);

//routes
var router = express.Router();
var ZoneEvents = {};
require('./app/routes')(router,Events, ZoneEvents);
app.use('/api',router);


//Development only configs
if (env == 'development') {
	var devRouter = express.Router();
	app.use('/dev',devRouter);
	require('./dev/devroutes')(devRouter,Zone);
}

//login to rift mobile services
var trionAuth = require('./app/riftauth');
trionAuth.on('ready', function(TrionAuth) {
	//load up ZoneEvent class module with session cookies
	var ZoneEvent = require('./app/riftzoneevents');
	var ZoneEvents = new ZoneEvent(TrionAuth);

	//when new events, update router
	ZoneEvents.on('newEvents', function(events) {
		console.log('new events');
	});
});


io.on('connection', function(socket) {
	socket.emit('news', {hello: 'world'});
});

//start app
app.listen(port);
console.log('Now listening on port: '+ port);
exports = module.exports = app;