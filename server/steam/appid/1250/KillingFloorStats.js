var request = require('request');
var util = require('util');
var _ = require('lodash');


var mapAchievements = require('./mapAchievements.json').mapAchievements;
var apiKey = require('../../config/apiKey.json').apiKey;
var userSummary = require('../../users/userSummary.js');

var KillingFloorStats = function(query, callback) {

	var _this = this;

	var parseAchievements = function(achievements) {
		//in format array -> object.name, object.achieved
		var achievementLength = achievements.length;
		var parsed = {};
		for (var i=0;i < achievementLength;i++) {
			if (_.contains(mapAchievements, achievements[i].name) && achievements[i].achieved === 1) {
				parsed[achievements[i].name] = 1;
			}
		}
		_this.maps = parsed;
		callback(_this);
	};


	var getKfStats = function() {
		var options = {
			url: "http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=1250&key=" + apiKey + "&steamid=" + _this.summary.steamid + "&format=json",
			encoding: 'utf8',
			method: 'GET',
			json: true
		};

		request(options, function(err, res, body) {
				if (!err && res.statusCode == 200 ) {
					//expected result format from the api call
					if (typeof body === 'object') {
						_this.kfstats = body.playerstats.stats;
						if (util.isArray(body.playerstats.achievements)) {
							parseAchievements(body.playerstats.achievements);
						}
					}
				}
				else {
					//if we get an error from steam, send to client
					_this.error = err;
					callback(_this);
				}
			});
	};

	var user = new userSummary(query, function(data){
		_this.summary = data;
		getKfStats();
	});
};

module.exports = KillingFloorStats;