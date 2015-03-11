var affixes = require('./data/affixes/index.js');
var affixMap = require('./data/affixes/affixMap.js');

var D3Item = function(dClass,slot,rarity,name,pCount,sCount) {
	this.rarity = rarity;
	this.type = slot;

	//the array of stats on the item
	this.primaries = [];
	this.secondaries = [];

	//if the name is given, use that, otherwise it is shit
	if (name) {
		this.name = name;
	}
	else {
		this.name = 'shit ' + rarity + ' ' + slot;
	}

	//determine the number of primary and secondaries to roll
	var primaryCount;
	var secondaryCount;
	(function() {
		//optional params to force the counts, both are provided or none
		//all legendary items force the count
		if (pCount || sCount) {
			primaryCount = pCount;
			secondaryCount = sCount;
			return;
		}
		//a magic item has one primary, and one secondary roll.
		else if (rarity === 'magic') {
			primaryCount = 1;
			secondaryCount = 1;
			return;
		}
		//it is a rare and we random between 2-4primary and 1-2 secondary
		//random*(max-min)+min
		else {
			primaryCount = Math.floor(Math.random()*(4-2))+1;
			secondaryCount = Math.floor(Math.random()*(2-1))+1;
			return;
		}
	})();

	//gets a list of stat keys that the item can currently roll
	// @param {string} affixType either primary or secondary
	var getStatKeys = function(affixType) {
		var keys = [];
		var allKeys = affixes[slot][affixType];

		for (var key in allKeys) {
			var excluded;
			var exists = (this.primaries.indexOf(key) !== -1);

			//if there is no exclude property
			if (!allKeys[key].hasOwnProperty('exclude')) {
				excluded = false;
			}
			//there is an exclude property and it needs to be checked
			else {
				//create a list of values to check against the exclude array
				var checks = [];
				//some properties are limited by their D3 Class
				checks.push(dClass);
				//some properties are limited by existing stats (like resists)
				checks.concat(this.primaries,this.secondaries);

				var excludes = allKeys[key].exclude;
				var exLength = excludes.length;

				for( var i = 0; i < exLength; i ++) {
					//if the exclude value is in our checks
					//set excluded to true and break this loop
					if (checks.indexOf(excludes[i]) !== -1) {
						excluded = true;
						break;
					}
				}
			}

			//if it is not excluded and it doesnt exist on the item yet
			//add to the list of rollable properties
			if (!excluded && !exists) {
				keys.push(key);
			}
		}
		console.log(keys);
		return keys;
	}.bind(this);

	//rolls a single stat for the item
	// @param {string} affixType either primary or secondary
	var rollStat = function(affixType) {
		var newStat = {};

		//get a list of possible affixes
		var keys = getStatKeys(affixType)
		var keyLength = keys.length;

		//roll for the stat
		var stat = keys[Math.floor(Math.random()*(keyLength - 1))];
		var statData = affixes[slot][affixType][stat];
		newStat.name = stat;

		//find the brackets to roll between
		var min;
		var max;

		//check if there is a special bracket for the rarity using first character of rarity
		var rarityMin = 'min'+rarity[0];
		if (statData.hasOwnProperty(rarityMin)) {
			min = statData[rarityMin];
			max = statData['max'+rarity[0]];
		}
		//otherwise use generic min/max keys
		else {
			min = statData.min;
			max = statData.max;
		}

		var rollBracket = function(minimum,maximum) {
			return Math.floor(Math.random()*(maximum - minimum))+minimum;
		};

		//if there are multiple brackets to roll, do so here
		if (Array.isArray(min) || Array.isArray(max)) {
			//multiple brackets so the value is now initialized as an array
			newStat.value = [];
			var bracketCount = min.length;
			for (var i = 0; i < bracketCount; i++ ){
				newStat.value.push(rollBracket(min[i],max[i]));
			}
		}
		else {
			newStat.value = rollBracket(min,max);
		}

		return newStat;

	}.bind(this);

	//roll primaries
	for (var i = 0; i < primaryCount; i ++) {
		this.primaries.push(rollStat('primary'));
	}
	//roll secondaries
	/*for (var i =0; i < secondaryCount; i++) {
		this.secondaries.push(rollStat('secondary'));
	}*/

};

module.exports = D3Item;