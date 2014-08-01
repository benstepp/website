var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

	//SteamID64 or CommunityID
	_id: String,

	//DisplayName of User
	personaName: String,

	//32x32 avatar
	avatar: String,

	//profileURL
	profileUrl: String,

	//Community Visibility State
	//	1 profile is not visible
	//	3 profile is public
	communityVisibilityState: Number,

	//array of friend IDs
	friends: Array

	//appid_achievement

	//appid_stats

});

//64x64 avatar
userSchema.virtual('avatar_medium')
	.get(function() {
		return this.avatar.replace('.jpg', '_medium.jpg');
	});

//184x184 avatar
userSchema.virtual('avatar_full')
	.get(function() {
		return this.avatar.replace('.jpg', '_full.jpg');
	});

//pulls customURL from profileURL if it exists
userSchema.virtual('customURL')
	.get(function() {
		var split = this.profileurl.split('/');
		var splitLength = split.length;
		var urlGarbage = ["http:","","www.steamcommunity.com","steamcommunity.com","id"];
		for (var i = 0;i < splitLength;i++) {
			if (split[i] === 'profiles') {
				customURL = null;
				break;
			}
			if (urlGarbage.indexOf(split[i]) === -1){
				customURL = split[i];
			}
		}
	});

//quick summary object
userSchema.virtual('summary')
	.get(function() {
		return {
			steamid: this._id,
			personaName: this.personaName,
			avatar: this.avatar,
			profileUrl: this.profileUrl,
			communityVisibilityState: this.communityVisibilityState
		};
	});


function userSummary(friend) {
		steamUser.findOne({_id: friend.steamid}, function(err, friend) {
			if (err) console.log(err);
			console.log(friend);
		});
	}
	
module.exports = mongoose.model('steamUser', userSchema);