//modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

//config
var port = process.env.PORT || 3000;
var env = process.env.NODE_ENV || 'production';

//Execute app
var app = express();
app.use(express.static(__dirname + '/build'));
app.use(bodyParser.json());
app.use(morgan());
var http = require('http').Server(app);
var io = require('socket.io')(http);


//app modules
require('./server/riftevents/main.js')(app, io);
require('./server/steam/main.js')(app, io);

//start app
http.listen(port);
console.log('Now listening on port: '+ port);
exports = module.exports = app;