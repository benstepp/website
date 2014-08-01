//libs
var request = require('request');
var userSummary = require('./userSummary.js');
//database
var SteamUser = require('../models/steamUser');

//configs
var apiKey = require('../config/apiKey.json').apiKey;
var idFinder = require('./idFinder.js');
var util = require('util');

var userFriends = function(query, callback) {

	var _this = this;

	var checkDb = function() {
		SteamUser.find({_id: _this.steamid}, function(err, user) {
			if (util.isArray(user.friends) && user.friends.length > 0) {
				_this.friends = user.friends;
			}
			else {
				friendApiCall();
			}

		});
	};

	var packFriends = function() {
		var friendsLength = _this.friends.length;

		for(var i=0; i< friendsLength;i++) {
			getSummary(i, friendsLength);
		}
	};
	var summaryCounter = 0;
	var getSummary = function(index, friendsLength) {
		var friend = new userSummary(_this.friends[index].steamid, function(summary) {
			//increments the counter
			summaryCounter++;
			//create a new object
			var friendObj = summary;
			friendObj.friend_since = _this.friends[index].friend_since;
			_this.friends[index] = friendObj;
			if (summaryCounter === friendsLength){ callback(_this); }
		});
	};

	//removes the specified key from friends array
	var removeKey = function(key) {
		var friendLength = _this.friends.length;
		for (var i=0; i < friendLength;i++) {
			delete _this.friends[i][key];
		}
	};

	//saves the friends with the friends since tag
	var saveFriends = function() {
		//first remove the relationship key
		removeKey('relationship');
		//then save the friends to database
		SteamUser.findOne({_id:_this.steamid}, function(err,user) {
			if (err) { console.log(err); }
			user.friends = _this.friends;
			user.save();
			packFriends();
		});
	};

	var friendApiCall = function() {
		var options = {
			url: "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?relationship=friend&key=" + apiKey + "&steamid=" + _this.steamid + "&format=json",
			encoding: 'utf8',
			method: 'GET',
			json: true
		};
		request(options, function(err, res, body) {
				if (!err && res.statusCode == 200 ) {
					//expected result format from the api call
					if (typeof body === 'object') {
						_this.friends = body.friendslist.friends;
						saveFriends();
					}
				}
				else {
					//if we get an error from steam, send to client
					_this.error = err;
					callback(_this);
				}
			});
	};

	var temp = new userSummary(query, function(data) {
		_this.steamid = data.steamid;
		checkDb();
	});


};

module.exports = userFriends;