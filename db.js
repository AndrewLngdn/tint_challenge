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
mongoose.connect('mongodb://nodejitsu:b7ff5e5e5cf66854fd84107f574b485c@troup.mongohq.com:10096/nodejitsudb3297978863');