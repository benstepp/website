var authConfig = require('./auth');

var mailOptions = {
	to:authConfig.user,
	subject:'FIGHTINGDRAGONSWITHTAYLORSWIFT Contact Form',
};

module.exports = mailOptions;