var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ZoneSchema = new Schema({
	_id: Number,
	name_en: String, //English
	name_fr: String, //French
	name_de: String //German
});

module.exports = mongoose.model('zone', ZoneSchema);