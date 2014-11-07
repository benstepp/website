var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	Schema = mongoose.Schema;

var EventSchema = new Schema({
	name_en: {type:String, unique:true}, //English
	name_fr: String, //French
	name_de: String, //German
	zones: Schema.Types.Mixed //Same indexes of the level
});

EventSchema.plugin(uniqueValidator);

module.exports = mongoose.model('event', EventSchema);