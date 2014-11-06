var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
	_id: String,

	name_en: String, //English
	name_fr: String, //French
	name_de: String, //German

	rarity: String,
	value: String,
	icon: String,

	slot: String,
	armor: String,
	armorType: String,
	weaponType: String,

	calling: Array,
	role: String,

	onEquip: Schema.Types.Mixed,

	drop: Schema.Types.Mixed
});


module.exports = mongoose.model('riftloot', ItemSchema);