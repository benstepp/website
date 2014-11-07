//modules
var express = require('express'),
	mongoose = require('mongoose'),
	_ = require('lodash'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),

//config
	port = process.env.PORT || 3000,
	env = process.env.NODE_ENV || 'development';

//Execute app
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(morgan());
var http = require('http').Server(app);
var io = require('socket.io')(http);

//database
mongoose.connect('mongodb://localhost/');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('connected to database');
});

//app modules
require('./server/riftevents')(app, io);
require('./server/steam')(app, io,_);
require('./server/riftloot')(app, io, _);

//start app
http.listen(port);
console.log('Now listening on port: '+ port);
exports = module.exports = app;