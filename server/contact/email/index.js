var nodemailer=require('nodemailer');
var assign = require('object-assign');

var authConfig = require('../config/auth');
var mailConfig = require('../config/mail');

var transport = nodemailer.createTransport({
	service:'Gmail',
	auth:{
		user:authConfig.user,
		pass:authConfig.pass
	}
});

function email(body,callback) {
	var options = assign({},mailConfig);
	options.from = body.name + ' <'+body.email+'>';
	options.test = body.message;

	transporter.sendMail(options, function(err,info) {
		if (err) {
			callback({error:err});
		}
		else {
			callback({info:info});
		}
	});

}

module.exports = email;