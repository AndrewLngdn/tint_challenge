// this file defines the battle schema
// and init's the connection to our mongoDB
// process

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var battleSchema = new Schema({
	tag1: String,
	tag2: String,
	tag1_count: Number,
	tag2_count: Number,
	created_at: String
});

mongoose.model('Battle', battleSchema);
mongoose.connect('mongodb://localhost:27017');