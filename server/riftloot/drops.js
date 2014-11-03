var q = require('q'),
	dropLocations = require('./config/dropLocations.js'),
	item = require('./models/item.js'),
	deferred = q.defer();
	//where all the items from db are saved
	pulledItems = {};

function getItemSummaries() {
	//array of promises for the database calls
	var promises = [];

	//for each drop tier(expert/rift/raid)
	for (var tier in dropLocations) {
		pulledItems[tier] = {};

		//for each dungeon
		for(var dungeon in dropLocations[tier]) {
			pulledItems[tier][dungeon] = {};
			
			//for each boss
			for (var boss in dropLocations[tier][dungeon]) {
				pulledItems[tier][dungeon][boss] = [];
				
				//for each item
				var bossLength = dropLocations[tier][dungeon][boss].length;
				for (var i = 0; i < bossLength; i++) {
					var promise = dbSearch(tier, dungeon, boss, dropLocations[tier][dungeon][boss][i]);
					promises.push(promise);
				}
			}
		}
	}

	//once all db calls are done, split up by language
	q.all(promises).then(function() {
		console.log('qall');
		languageSplit();
	});

}

function dbSearch(tier, dungeon, boss, itemId) {
	var deferred = q.defer();

	item.findOne({_id: itemId}, function(err, itemm) {
		if (err) {
			console.log(err);
		}
		else {
			//push item onto the array at that boss
			pulledItems[tier][dungeon][boss].push(itemm);
			deferred.resolve();
		}
	});

	return deferred.promise;
}

function languageSplit() {
	var items = {
		de: {},
		en: {},
		fr: {}
	};

	//the most disgusting nested for loops i've ever seen
	for (var lang in items) {
		var itemObj = pulledItems;
		for (var tier in itemObj) {
			items[lang][tier] = {};
			for(var dungeon in itemObj[tier]) {
				items[lang][tier][dungeon] = {};
				for(var boss in itemObj[tier][dungeon]) {
					items[lang][tier][dungeon][boss] = [];
					var bossLength = itemObj[tier][dungeon][boss].length;
					for (var i =0; i < bossLength; i ++) {
						var itemm = keyCheck(itemObj[tier][dungeon][boss][i], lang);
						items[lang][tier][dungeon][boss].push(itemm);
					}
				}
			}
		}
	}

	//global promise for this module
	deferred.resolve(items);

}

function keyCheck(itemm, lang) {
	var nItem = {};
	var nameLocale = 'name_'+lang;
	var abilityLocale = 'ability_'+lang;

	for (var key in itemm) {
		//do not add names
		if(key === 'name_de' || key === 'name_en' || key === 'name_fr') {
			
			continue;
		}
		else if(key === 'onEquip') {
			nItem[key] = {};
			for(var stat in itemm[key]) {
				if (stat === 'ability_de' || stat === 'ability_en' || stat === 'ability_fr') {
					continue;
				}
			}
		}
		else {
			nItem[key] = itemm[key];
		}
	}
	nItem.name = itemm[nameLocale];
	if(typeof itemm.onEquip !== 'undefined' && typeof itemm.onEquip.ability_en !== 'undefined') {
		nItem.onEquip.ability = itemm.onEquip[abilityLocale];
	}
	
	return nItem;
}

getItemSummaries();

module.exports = deferred.promise;