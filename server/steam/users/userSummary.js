var request = require('request');
var apiKey = require('../config/apiKey.json').apiKey;
var idFinder = require('./idFinder.js');

var UserSummary = function(query, callback) {
	var _this = this;

	var getPlayerSummary = function() {

		var options = {
			url: "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + apiKey + "&steamids=" + _this.id64,
			encoding: 'utf8',
			method: 'GET',
			json: true
		};

		request(options, function(err, res, body) {
				if (!err && res.statusCode == 200 ) {
					//expected result format from the api call
					if (typeof body === 'object') {
						_this.summary = body.response.players[0];
						callback(_this);
					}
				}
				else {
					console.log(err); 
				}
			});
	};

	_this = new idFinder(query, getPlayerSummary);
};

module.exports = UserSummary;