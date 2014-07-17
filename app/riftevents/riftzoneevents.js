//Modules
var request = require('request');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

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
			if (!err && res.statusCode == 200) {
				parseEvents(shard, body);
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
		for (var i = 0; i < zoneLength; i++) {
			if (zones[i].hasOwnProperty('name')) {
				zoneEvents.push(zones[i]);
			}		
		}
		//save the events if they are different
		if(!checkZoneEvents(shard, zoneEvents)) {
			_this.lastUpdated = Date.now();
			localeCheck(shard,zoneEvents);
			_this.events[shard.region][shard.shardName] = zoneEvents;
			packEvents();
		}
	};

	//checks if the zone events have changed
	var checkZoneEvents = function(shard, newEvents) {
		var oldEvents = _this.events[shard.region][shard.shardName];
		var oldEventsLength = oldEvents.length;
		var newEventsLength = newEvents.length;

		for (var i = 0; i < newEventsLength; i++) {
			//loop through all old events
			for (var j = 0; j < oldEventsLength; j++) {
				if (newEvents[i].name === oldEvents[j].name &&
					newEvents[i].zone === oldEvents[j].zone &&
					newEvents[i].started === oldEvents[j].started) {
					return true;
				}
			}
		}
		//else return false
		return false;
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
			delete events[i].name;
			delete events[i].zoneId;
		}
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
					newEvent.shard = shard;
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

	//initialize events
	updateEvents();
	setInterval(updateEvents, 60000);

};

//inherit event emitter and export class
util.inherits(ZoneEvent, EventEmitter);
module.exports = ZoneEvent;