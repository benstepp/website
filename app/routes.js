module.exports = function(router,Events, ZoneEvents){

	router.use(function(req, res, next) {
		console.log("Router being used");
		next();
	});

	//server routes
	router.route('/events')
		//Get all events /api/events/
		.get(function(req, res) {
			Events.find(function(err, events) {
				if (err){
					res.json({ success:'0' , message:err });
				}
				else if (events.length === 0) {
					res.json({ success:'0' , message: 'events not found in database' });
				}
				else {
					res.json({ success:'1' , events:events });
				}
			});
		})
		//Post an event /api/events/
		.post(function(req,res){
			var event = new Events();

		});

	//Get a single event /api/:event#
	router.get('/events/:event_id', function(req, res) {
		Events.findById(req.params.event_id, function(err, event) {
			if (err){
				err.success = '0';
				res.json(err);
			}
			else {
				res.json({ success:'1' , events:events });
			}
		});
	});

	

	//frontend routes
	/*router.get('*', function(req, res){
		res.sendfile('./public/index.html');
	});*/

};