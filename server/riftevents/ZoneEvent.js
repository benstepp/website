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
var Zone = require('./models/zone.js');

//events
var eventsList = require('./config/events.json').events;
var eventsListLength = eventsList.length;
var Event = require('./models/event.js');

var ZoneEvent = function(trionAuth) {

	//use _this because of problems with this in request library
	var _this = this;
	//all events are saved in this object in events.region.shard -> array of events
	this.events = {};

	//initialize total shard count
	this.shardCount = 0;
	for (var region in shards) {
			this.shardCount += shards[region].length;
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
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		};

		//if logged into auth server send session cookie
		var sessionCookie = trionAuth['session_chat'+shard.chatServer] || undefined;
		if (sessionCookie) {
			options.headers.Cookie = sessionCookie;
		}

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

	//sorts through trion data and removes zones without an event occuring
	// @shard is the object for the shard from shards.js
	// @body is the response body from the trion api request
	var parseEvents = function(shard, body) {
		var zones = body.data;
		var zoneLength = zones.length;
		var zoneEvents = [];
		//remove all zones without events on the shard
		for (var i = 0; i < zoneLength; i++) {
			if (_.has(zones[i], 'name')) {
				var newEvent = createEvent(zones[i], shard);
				zoneEvents.push(newEvent);
			}		
		}

		//save the events if they are different
		if(checkZoneEvents(shard, zoneEvents)) {
			_this.lastUpdated = Date.now();
			_this.events[shard.region][shard.shardName] = zoneEvents;
			packEvents();
		}
	};

	// @event is the object from trion with a name and started field
	// @shard is the object for the shard from shards.js
	var createEvent = function(event, shard) {

		var locales = ['de','en','fr'];
		var newEvent = {};
		/*
			{
				zone: zoneId from trion && _id of Zone in db
				started: started from trion
				shard: shardName
				name_xx: name of event from trion
			}
		*/

		//save the name of the event by the locale of the shard
		var nameLocale = 'name_' + shard.locale;
		newEvent[nameLocale] = event.name;
		newEvent.zone = event.zoneId;
		newEvent.started = event.started;
		newEvent.shard = shard.shardName;

		return newEvent;

	};

	var checkZoneEvents = function(shard, newEvents) {
		var oldEvents = _this.events[shard.region][shard.shardName];

		//we call socket here because we already calculated data needed.
		var addedEvents = eventDifference(newEvents, oldEvents);
		var removedEvents = eventDifference(oldEvents,newEvents);
		
		ioEvents(shard, addedEvents, removedEvents);

		//return both the added and removed events. 
		return addedEvents.concat(removedEvents);
	};

	var eventDifference = function(arrayOne, arrayTwo) {
		var arrayOneLength = arrayOne.length || 1;
		var arrayTwoLength = arrayTwo.length || 1;
		var difference = [];

		outerLoop:
		for (var i=0; i < arrayOneLength; i++) {

			innerLoop:
			for (var j=0;j < arrayTwoLength; j++) {
				var isEqual = _.isEqual(arrayOne[i], arrayTwo[j]);
				//if they are the same, continue
				if(isEqual) {
					continue outerLoop;
				}
				//if they are not the same, and on last of index second array
				if(!isEqual && j+1 === arrayTwoLength) {
					difference.push(arrayOne[i]);
				}
			}

		}

		return difference;
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
				var eventCounter = 1;
				for (var i = 0; i < shardLength; i++) {
					var newEvent = _this.events[region][shard][i];
					var dbName = newEvent.name_en || newEvent.name_fr || newEvent.name_de;
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
			var addedJson = {
				action: "add",
				events: addedEvents
			};
			
			_this.emit('add', addedJson);
		}
		if (removedCount > 0) {
			var removedJson = {
				action: "remove",
				events: removedEvents
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