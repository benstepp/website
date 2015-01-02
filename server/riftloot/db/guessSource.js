var _ = require('lodash'),

	checks = {
	isExpertVendor: isExpertVendor,
	isMauraderBox: isMauraderBox,
	isRaidIVendor: isRaidIVendor,
	isWorldVendor: isWorldVendor
	},

	guessSource = function(item) {
		var source;
		_.forEach(checks, function(check) {
			if (check(item)) {
				source = check(item);
			}
		});
		if (source) {
			item.drop.other = source;
		}
		return item;
	};

function isExpertVendor(item) {
	var test = ((item.name_en.indexOf("Abyssal Crusader's") !== -1) && item.rarity === "Rare");
	return test ? "Expert Vendor": false;
}

function isMauraderBox(item) {
	return (item.name_en.indexOf("Marauder's") !== -1) ? "Marauder's Supply Cache": false;
}

function isRaidIVendor(item) {
	return (item.name_en.indexOf("Frost Keeper's") !== -1) ? "Raid I Vendor": false;
}

function isWorldVendor(item) {
	return (item.name_en.indexOf("Void Seeker's") !== -1) ? "World Vendor" : false;
}


module.exports = guessSource;