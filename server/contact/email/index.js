var nodemailer=require('nodemailer');
var assign = require('object-assign');

var authConfig = require('../config/auth');
var mailConfig = require('../config/mail');

//create the transporter if given a password
var transporter;
if (authConfig.pass) {
	transporter = nodemailer.createTransport({
		service:'Gmail',
		auth:{
			user:authConfig.user,
			pass:authConfig.pass
		}
	});
}


function email(body,callback) {

	//if the password is not set return immediately with error
	if (!authConfig.hasOwnProperty('pass')) {
		callback({error:'Server authentication misconfigured. Contact server administrator.'});
	}

	else {
		var options = assign({},mailConfig);
		options.from = body.name + ' <'+body.email+'>';
		options.text = body.message;

		transporter.sendMail(options, function(err,info) {
			if (err) {
				callback({error:1});
			}
			else {
				callback({error:0});
			}
		});
	}

}

module.exports = email;