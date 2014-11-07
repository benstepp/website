//libs
var request = require('request'),
//database
	SteamUser = require('../models/steamUser'),
//configs
	apiKey = require('../config/apiKey.json').apiKey,
	idFinder = require('./idFinder.js');

var UserSummary = function(query, callback) {
	//use _this because of request library
	var _this = this;

	//makes an api call to get the player summary
	var getPlayerSummary = function() {

		var options = {
			url: "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + apiKey + "&steamids=" + steamid.id64,
			encoding: 'utf8',
			method: 'GET',
			json: true
		};

		request(options, function(err, res, body) {
				if (!err && res.statusCode == 200 ) {
					//expected result format from the api call
					if (typeof body === 'object') {
						var summary = body.response.players[0];
						var data = {
								_id: summary.steamid,
								personaName: summary.personaname,
								avatar: summary.avatar.replace('http://media.steampowered.com/steamcommunity/public/images/avatars/',''),
								profileUrl: summary.profileurl.replace('http://steamcommunity.com/',''),
								communityVisibilityState: summary.communityvisibilitystate,
							};
						var newUser = new SteamUser(data);
						_this = newUser.summary;
						newUser.save(function(err) {
							if(err) { console.log(err); }
							callback(_this);
						});
					}
				}
				else {
					console.log(err); 
				}
			});
	};

	//checks the collection for a summary
	var checkDB = function() {
		SteamUser.findOne({_id: _this.steamid}, function(err, player) {
			if (err) { console.log(err); }
			//if the player was not found in the database make an api call
			if (player === null) {
				getPlayerSummary();		
			}
			//we found the player so lets just go to passed callback
			else{
				_this = player.summary;
				callback(_this);
			}
		});

	};


	var steamid = new idFinder(query, function(id) {
		_this.steamid = id;
		checkDB();
	});

};

module.exports = UserSummary;