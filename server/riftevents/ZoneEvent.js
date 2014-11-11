//Modules
var request = require('request'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	_ = require('lodash'),
	q = require('q'),

//Trion URLs 
	trionhosts = require('./config/trionhosts.js'),
//Shard Id List
	shards = require('./config/shards.js'),
//zones
	Zone = require('./models/zone.js'),

//events
	eventsList = require('./config/events.json').events,
	eventsListLength = eventsList.length,
	Event = require('./models/event.js');

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


	//packs the events into a single array separated by region.
	var packEvents = function() {
		var events = _this.events;

		var packed = {
			EU:{},
			US:{}
		};

		var promises = [];

		//for each region
		for (var region in events) {

			//for each shard
			var eventArray = [];
			for (var shard in events[region]) {

				//for each event
				var shardLength = events[region][shard].length;
				var eventCounter = 1;
				for (var i = 0; i < shardLength; i++) {
					var newEvent = events[region][shard][i];
					eventArray.push(newEvent);
				}

			}

			//packedEvents is a promise for every event in a region.
			var packedEvents = getEventNames(eventArray, region);
			promises.push(packedEvents);

			packedEvents.then(function(events) {
				//pull and delete the region from events argument.
				var reg = events.region;
				delete events.region;

				packed[reg].events = events;
			});
			
		}

		q.all(promises).then(function() {
			_this.emit('newEvents', packed, _this.lastUpdated);
		});
		
	};

	//gets the full names for each event in each language
	var getEventNames = function(eventArray, reg) {
		
			var deferred = q.defer();
			
			//Array of promises for each event
			var promises = [];

			var length = eventArray.length;
			for (var i=0; i < length; i++) {
				//this pulls the name_** for the event object
				var dbQuery = _.omit(eventArray[i], ['zone', 'started', 'shard']);
				promises.push(dbEventQuery(dbQuery,eventArray[i]));
			}
			
			q.all(promises).then(function(events) {
				//set region here to pass it to packEvents function.
				//q library can only have one argument in .then function call
				events.region = reg;

				deferred.resolve(events);
			});
			
			return deferred.promise;
		
	};

	var dbEventQuery = function(dbQuery,event) {
		var deferred = q.defer();
		
		Event.findOne(dbQuery, function dbCallback(err,ev) {
			var newEvent = event;

			//if the event is not in databse translations don't get set
			if (ev !== null) {
				newEvent.name_de = ev.name_de;
				newEvent.name_en = ev.name_en;
				newEvent.name_fr = ev.name_fr;
			}
			
			deferred.resolve(newEvent);
		});

		return deferred.promise;
	};

	//updates all events on shards
	var updateEvents = function() {
		_this.lastChecked = Date.now();

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
			
			//_this.emit('add', addedJson);
		}
		if (removedCount > 0) {
			var removedJson = {
				action: "remove",
				events: removedEvents
			};

			//_this.emit('remove', removedJson);
		}
	};

	//initialize events
	updateEvents();
	setInterval(updateEvents, 60000);
};

//inherit event emitter and export class
util.inherits(ZoneEvent, EventEmitter);
module.exports = ZoneEvent;