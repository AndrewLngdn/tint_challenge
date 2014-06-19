var mongoose = require('mongoose');
var Battle = mongoose.model('Battle');
// var config = require('../config');
var Twit = require('twit');
var EventEmitter = require( "events" ).EventEmitter;
var updateEmitter = new EventEmitter();

var twit = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
// var twit = new Twit({
//     consumer_key: config.consumer_key,
//     consumer_secret: config.consumer_secret,
//     access_token: config.access_token,
//     access_token_secret: config.access_token_secret
// });

// this holds all the tags that filter the twitter stream
var tags = [];

// this gets called when this file is included,
// when the server starts
getTagsAndStartStream();

// tags are updated when there's a POST to /battles/create
updateEmitter.on('update_tags', getTagsAndStartStream);

// grabs all the tags from our battles
function getTagsAndStartStream(){
	Battle.find(function (err, battles, count){

		battles.forEach(function(battle){
			if (tags.indexOf(battle.tag1) === -1){
				tags.push(battle.tag1);
			}
			if (tags.indexOf(battle.tag2) === -1){
				tags.push(battle.tag2);
			}
		});
		startStreamCapture();
	});
}

// connects to the streaming API, filtering by 
// the tags from the battles
function startStreamCapture(){
	var stream = twit.stream('statuses/filter', {track: tags});
	console.log(stream);
	stream.on('tweet', function(tweet){
		tweet.entities.hashtags.forEach(updateCorrespondingBattle);
	});
}

// this updates the battles if the hashtag
// object matches the battle tag. We then
// emit an event, which tells socket.io
// to push the battle to the client
function updateCorrespondingBattle(hashtagObject){
	var hashtag = '#' + hashtagObject.text.toLowerCase();

	if (tags.indexOf(hashtag) !== -1){
		Battle.find({tag1: hashtag}, function(err, battles){
			battles.forEach(function(battle){
				battle.tag1_count++;
				battle.save();
				updateEmitter.emit('battle_update', battle);
			});
		});

		Battle.find({tag2: hashtag}, function(err, battles){
			battles.forEach(function(battle){
				battle.tag2_count++;
				battle.save();
				updateEmitter.emit('battle_update', battle);
			});
		});
	}
}


module.exports = updateEmitter;