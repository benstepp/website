var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
	name_en: {type:String, unique:true}, //English
	name_fr: String, //French
	name_de: String, //German
	zones: Schema.Types.Mixed //Same indexes of the level
});

module.exports = mongoose.model('event', EventSchema);