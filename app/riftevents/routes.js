var zones = require('./config/zones.json').zones;

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
	router.route('/:region')
		//Get all events /api/riftevents/events/
		.get(function(req, res) {
			//if valid region send just that region
			if (req.params.region === 'US' || 
				req.params.region ==='EU') {
				res.json(events[req.params.region]);
			}
			else if (req.params.region === 'zones'){
				res.json(zones);
			}
			//otherwise send everything
			else {
				res.json(events);
			}
		});

	router.route('/')
		.get(function(req, res) {
			res.json(events);
		});

	//only get the last updated time /api/riftevents/lastUpdated
	router.route('/lastUpdated')
		.get(function(req, res) {
			res.json({success: '1', message: lastUpdated});
		});
		
};