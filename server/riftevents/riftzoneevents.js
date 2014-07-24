//Modules
var request = require('request');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

//Trion URLs 
var trionhosts = require('./config/trionhosts.js');
//Shard Id List
var shards = require('./config/shards.js');
//zones
var zones = require('./config/zones.json').zones;
var zonesLength = zones.length;

//events
var eventsList = require('./config/events.json').events;
var eventsListLength = eventsList.length;

//lodash mixins
var mixin = require('./config/arrayobject.js');
_.mixin(mixin);

var ZoneEvent = function(trionAuth) {

	//use _this because of problems with this in request library
	var _this = this;
	this.events = {};

	//initialize total shard count
	this.shardCount = 0;
	for (var k in shards) {
			this.shardCount += shards[k].length;
	}

	//initialize events with empty arrays
	for (var key in shards) {
		//object for each region
		this.events[key] = {};
		var shardCount = shards[key].length;
		for (var i = 0; i < shardCount; i++) {
			//array of events for each shard
			this.events[key][shards[key][i].shardName] = [];
		}
	}

	//http request the events for a single shard 
	var getEvents = function(shard) {
		var options = {
			url: trionhosts['zoneevent'+shard.chatServer] + shard.shardId,
			encoding: 'utf8',
			method: 'GET',
			json: true,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Cookie': trionAuth['session_chat'+shard.chatServer]
			},
		};

		request(options, function(err, res, body) {
			if (!err && res.statusCode == 200 ) {
				//expected result format from the api call
				if (typeof body === 'object' && body.status === 'success') {
					parseEvents(shard, body);
				}
				//error here if not an object
			}
			else {
				console.log(err); 
			}
		});
	};

	//remove zones without an event occuring
	var parseEvents = function(shard, body) {
		var zones = body.data;
		var zoneLength = zones.length;
		var zoneEvents = [];
		//remove all zones without events on the shard
		for (var i = 0; i < zoneLength; i++) {
			if (_.has(zones[i], 'name')) {
				zoneEvents.push(zones[i]);
			}		
		}
		//save the events if they are different
		if(checkZoneEvents(shard, zoneEvents)) {
			_this.lastUpdated = Date.now();
			_this.events[shard.region][shard.shardName] = zoneEvents;
			packEvents();
		}
	};

	//checks if the zone events have changed
	var checkZoneEvents = function(shard, newEvents) {
		var oldEvents = _this.events[shard.region][shard.shardName];
		//we call socket here because we already calculated data needed.
		var addedEvents = _.difference(newEvents, oldEvents);
		var removedEvents = _.difference(oldEvents,newEvents);
		ioEvents(shard, addedEvents, removedEvents);
		return addedEvents;
	};

	var localeCheck = function(shard, events) {
		var eventsLength = events.length;
		var localeName = 'name_'+shard.locale;
		for (var i = 0; i <eventsLength;i++) {
			//sets the zone to an id number
			events[i].zone = getZoneId(events[i], localeName);
			events[i].name_en = getNames(events[i], localeName, 'name_en');
			events[i].name_fr = getNames(events[i], localeName, 'name_fr');
			events[i].name_de = getNames(events[i], localeName, 'name_de');
			events[i].shard = shard.shardName;
			if (typeof events[i].name !== undefined) {
				delete events[i].name;
			}
			if (typeof events[i].zoneId !== undefined) {
				delete events[i].zoneId;
			}
		}
		return events;
	};

	var getZoneId = function(event, localeName) {
		for (var j = 0; j < zonesLength; j++) {
			if (zones[j][localeName] === event.zone) {
				return j;
			}
		}
	};

	var getNames = function(event, localeName, toLocale) {
		//return if locale of server is same as requested
		if (localeName === toLocale) {
			return event.name;
		}
		//otherwise search through events list for the event
		else {
			for (var j = 0;j < eventsListLength;j++) {
				if(eventsList[j][localeName] === event.name) {
					return eventsList[j][toLocale];
				}
			}
			//return name if not in json yet
			return event.name;
		}
	};

	var packEvents = function() {
		var packed = {
			EU:{},
			US:{}
		};
		//for each region
		for (var region in _this.events) {
			//for each shard
			var eventArray = [];
			for (var shard in _this.events[region]) {
				//for each event
				var shardLength = _this.events[region][shard].length;
				for (var i = 0; i < shardLength; i++) {
					var newEvent = _this.events[region][shard][i];
					//newEvent.shard = shard;
					eventArray.push(newEvent);
				}
			}
			packed[region].events = eventArray;
			packed[region].lastUpdated = _this.lastUpdated;
			_this.emit('newEvents', packed, _this.lastUpdated);
		}
	};

	//updates all events on shards
	var updateEvents = function() {
		for (var k in shards) {
			var shardCount = shards[k].length;
			for (var i = 0; i < shardCount; i++) {
				getEvents(shards[k][i]);
			}
		}
	};

	var ioEvents = function(shard, addedEvents, removedEvents) {
		var addedCount = addedEvents.length;
		var removedCount = removedEvents.length;
		if (addedCount > 0) {

			var added = localeCheck(shard,addedEvents);
			var addedJson = {
				action: "add",
				events: added
			};
			_this.emit('add', addedJson);
		}
		if (removedCount > 0) {
			var removed = localeCheck(shard,removedEvents);
			var removedJson = {
				action: "remove",
				events: removed
			};
			_this.emit('remove', removedJson);
		}
	};

	//initialize events
	updateEvents();
	setInterval(updateEvents, 60000);
};

//inherit event emitter and export class
util.inherits(ZoneEvent, EventEmitter);
module.exports = ZoneEvent;