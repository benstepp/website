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
	router.route('/')
		//Get all events /api/riftevents/events/
		.get(function(req, res) {
			//build the json
			var eventPacked = events;
			eventPacked.lastUpdated = lastUpdated;
			res.json(eventPacked);
		});

	//get events for a single region /api/riftevents/region/ID
	router.route('/region/:region')
		.get(function(req, res) {
			//check for valid region
			if (req.params.region === 'US' || 
				req.params.region ==='EU1' || 
				req.params.region ==='EU2') {
				var eventPacked = {};
				eventPacked[req.params.region] = events[req.params.region];
				eventPacked.lastUpdated = lastUpdated;
				res.json(eventPacked);
			}
			else {
				res.json({success:'0', message: 'invalid region parameter: US, EU1, EU2 '});
			}
		});

	//only get the last updated time /api/riftevents/lastUpdated
	router.route('/lastUpdated')
		.get(function(req, res) {
			res.json({success: '1', message: lastUpdated});
		});

};