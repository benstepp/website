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

			//request does not have a body
			if( !req.body ) {
				res.json({error:validApiOptions.missingBody});
			}

			//request is missing the content-type header or it is incorrect
			else if ( !req.headers.hasOwnProperty('content-type') && req.headers['content-type'] === 'application/json') {
				res.json({error:validApiOptions.missingHeader});
			}

			//request body does not match corrent format
			else if (Object.keys(req.body).length !== 3 || _.difference(Object.keys(req.body),validApiOptions.keys).length !== 0) {
				res.json({error:validApiOptions.incorrectJson});
			}

			//invalid email provided. currently has issues see:
			//github.com/chriso/validator.js/issues/258
			//else if (validator.isEmail(req.body.email)) {
			//	res.json({error:validApiOptions.invalidEmail});
			//}

			else {
				var newEmail = email(req.body, function (data) {
					res.json(data);
				});
			}


		});

};