var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
	name_en: String, //English
	name_fr: String, //French
	name_de: String, //German
	level: Array, //Array of levels
	zone: Array, //Same indexes of the level
	magelo: Array, //same indexes of the level
	length: Array //length in seconds of the event
});

module.exports = mongoose.model('event', EventSchema);