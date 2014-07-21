//modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

//config
var port = process.env.PORT || 80;
var env = process.env.NODE_ENV || 'production';

//Execute app
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(morgan());
var http = require('http').Server(app);
var io = require('socket.io')(http);


//app modules
var riftevents = require('./app/riftevents/main')(app, io);

//start app
http.listen(port);
console.log('Now listening on port: '+ port);
exports = module.exports = app;