var validApiOptions = {
	//list of keys given in body json
	keys:['name','email','message'],

	//error messages for invalid options
	missingBody:'The request has no body.',
	missingHeader:'content-type HTTP header was missing or incorrect',
	incorrectJson:'Json does not match provided format',
	invalidEmail:'Invalid email address provided'
};

module.exports = validApiOptions;