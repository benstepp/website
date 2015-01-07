var mongoose = require('mongoose');
var util = require('util');
var EventEmitter = new require('events').EventEmitter;

//connect to database
mongoose.connect('mongodb://localhost/');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('connected to database');

	var zones = new seedZones();
	zones.on('done', function() {
		console.log('zones saved');
	});

	var events = new seedEvents();
	events.on('done', function() {
		console.log('events saved');
	});

});

function seedZones() {
	var _this = this;
	var zones = require('../config/zones.js').zones;
	var Zone = require('../models/zone.js');
	var zoneLength = zones.length;
	var zoneCounter = 1;
	for (var i =0; i < zoneLength; i++) {
		var newZone = new Zone(zones[i]);
		newZone.save(function(err) {
			zoneCounter++;
			if (zoneCounter === zoneLength) {
				_this.emit('done');
			}
		});
	}
}
util.inherits(seedZones, EventEmitter);

function seedEvents() {
	var _this = this;
	var events = require('../config/events.json').events;
	var Event = require('../models/event.js');
	var eventLength = events.length;
	var eventCounter = 1;
	for (var j=0; j < eventLength;j++) {
		var newEvent = new Event(events[j]);
		newEvent.save(function(err) {
			eventCounter++;
			if (eventCounter === eventLength) {
				_this.emit('done');
			}
		});
	}
}
util.inherits(seedEvents, EventEmitter);


