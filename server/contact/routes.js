var validator = require('validator');
var _ = require('lodash');

var validApiOptions = require('./config/validApiOptions');
var email = require('./email');

module.exports = function(router) {

	router.use(function(req, res, next) {
		console.log("Contact router being used");
		next();
	});

	router.route('/email')
		.post(function(req,res) {

				//request has a body
			if( req.body && 
				//request body has 3 keys
				Object.keys(req.body).length === 3 &&
				//those 3 keys are the same as the valid api options
				_.difference(Object.keys(req.body),validApiOptions.keys).length === 0 &&
				//the given email is valid
				validator.isEmail(req.body.email)) {

				var newEmail = email(req.body, function (data) {
					res.json(data);
				});

			}
			else {
				res.json({error:validApiOptions.error});
			}
		});

};