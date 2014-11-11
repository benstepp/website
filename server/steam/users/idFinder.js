var request = require('request'),
	apiKey = require('../config/apiKey.json').apiKey;

var idFinder = function(query, callback) {
	//use _this because of request library
	var _this = this;

	//checks if the query is numeric
	var isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};

	//steam web api call to resolve vanity url
	var resolveVanityUrl = function() {
		var options = {
			url: "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key="+ apiKey +"&vanityurl="+query,
			encoding: 'utf8',
			method: 'GET',
			json: true
		};

		request(options, function(err, res, body) {
				if (!err && res.statusCode == 200 ) {
					//expected result format from the api call
					if (typeof body === 'object') {
						if(body.response.success === 1) {
							_this.id64 = body.response.steamid;
							callback(_this.id64);
						}
					}
				}
				else {
					console.log(err); 
				}
			});
	};

	//check if the query is a number
	if (isNumber(query)) {
		//check if it is between the proper values
		if (query >= 76561190000000000 && query <= 76561199999999999) {
			_this.id64 = query;
			callback(_this.id64);
		}
	}
	else {
		resolveVanityUrl(query);
	}

};

module.exports = idFinder;