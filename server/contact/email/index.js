var nodemailer=require('nodemailer');
var assign = require('object-assign');

var authConfig = require('../config/auth');
var mailConfig = require('../config/mail');

var transporter = nodemailer.createTransport({
	service:'Gmail',
	auth:{
		user:authConfig.user,
		pass:authConfig.pass
	}
});

function email(body,callback) {
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

module.exports = email;