var dropLocations = require('./config/dropLocations.js'),
	item = require('./models/item.js');

function getItemSummaries() {

	//for each drop tier(expert/rift/raid)
	for (var tier in dropLocations) {

		//for each dungeon
		for(var dungeon in dropLocations[tier]) {

			//for each boss
			for (var boss in dropLocations[tier][dungeon][boss]) {



			}


		}

	}

}
