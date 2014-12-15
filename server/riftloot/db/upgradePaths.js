var q = require('q'),
	item = require('../models/item.js'),
	_ = require('lodash');


var getUpgradePaths = function(itemA) {

	//pvp items start with marauder's and are rare
	if(_.contains("Marauder's ") && itemA.rarity === 'Rare') {
		var stats = _.keys(itemA.OnEquip);

		//find db item in same slot
		item.find({slot:slot})
			.where(function() {
				//names of pvp items are of either ephemeral or dreambreaker
				var correctName = _.contains(_this.name_en, "Ephemeral") || _.contains(_this.name_en, "Dreambreaker");
				
				//list of stats on the item
				var itemStats = _.keys(this.onEquip);
				var correctStats = _.difference(stats, itemStats);

				return correctName && (correctStats.length === 0);
			})
			.exec(function(results) {
				_.forEach(results, function() {
					if(_.contains(_this.name_en, "Ephemeral")) {
						itemA.upgradePaths.save
					}
					itemA.upgradePaths = [[]];
				});
			});
	}




};

var allFromDb = function() {
	item.find()
	.exec(function(err,res) {
		_.forEach(res,getUpgradePaths);
	});
}

allFromDb();

//module.exports = getUpgradePaths;