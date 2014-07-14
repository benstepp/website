//Required modules
var request = require('request');
var querystring = require('querystring');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
//Account info imported from .gitignore file
var account = require('./config/account.js');
//Trion URLS 
var trionhosts = require('./config/trionhosts.js');

//Login to authentication server
var TrionAuth = function() {

	var _this = this;

	var authRequest = function(opts, postData, callback) {
		var options = {
			url: trionhosts[opts],
			encoding: 'utf8',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: postData
		};

		request(options, function(err, res, body) {
			if (!err && res.statusCode == 200) {
				callback(opts, res, body);
			}
			else {
				console.log(err);
			}
		});
	};

	//logs into the chat servers
	var authCallback = function(opts, res, body) {
		console.log('Successfully Authenticated');
		var postData = querystring.stringify({
			'ticket':body
		});
		authRequest('chatus', postData, chatCallback);
		authRequest('chateu', postData, chatCallback);
	};

	//saves set cookie header from chat login
	var chatCallback = function(opts, res, body) {
		console.log('Successfully logged into ' + opts + ' Server.');
		var authCookie = JSON.stringify(res.headers['set-cookie']);
		var sessionId = authCookie.split('=')[1].split(';')[0];
		_this['session_' + opts] = sessionId;
		eventCheck();
	};

	//once both chat servers are logged into 
	var eventCheck = function() {
		if (typeof _this.session_chatus !== 'undefined' && typeof _this.session_chateu !== 'undefined') {
			_this.emit('ready', _this);
		}
	};

	//Constructor
	var postData = querystring.stringify({
		'username': account.username,
		'password': account.password,
		'channel': 1
	});

	authRequest('auth', postData, authCallback);

};

//inherit event emitter and export the class
util.inherits(TrionAuth, EventEmitter);
module.exports = new TrionAuth();