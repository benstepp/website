var zones = require('./config/zones.js');

module.exports = function(router,Events, zEvents){

	router.use(function(req, res, next) {
		console.log("Router being used");
		next();
	});

	var events = {};
	var lastUpdated = '';

	//events emitted from zoneevents when it is updated
	zEvents.on('newEvents', function(newEvents, newLastUpdated) {
		events = newEvents;
		lastUpdated = newLastUpdated;
	});

	//server routes
	router.route('/lastUpdated')
		.get(function(req, res) {
			res.json({success: '1', message: lastUpdated});
		});

	router.route('/zones')
		.get(function(req,res) {
			res.json(zones);
		});

	router.route('/events')
		.get(function(req, res) {
				res.json(events);
		});

	router.route('*')
		.get(function(req,res) {
			res.json({error:'true'});
		});

};