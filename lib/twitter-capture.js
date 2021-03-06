var mongoose = require('mongoose');
var Battle = mongoose.model('Battle');
// var config = require('../config');
var Twit = require('twit');
var EventEmitter = require( "events" ).EventEmitter;
var updateEmitter = new EventEmitter();

var missing_keys = false;

if (process.env.TWITTER_CONSUMER_KEY === undefined){
	missing_keys = true;
	console.log("Error: You must define the TWITTER_CONSUMER_KEY environment variable to connect to Twitter");
}
if (process.env.TWITTER_CONSUMER_SECRET === undefined){
	missing_keys = true;
	console.log("Error: You must define the TWITTER_CONSUMER_SECRET environment variable to connect to Twitter");
}
if (process.env.TWITTER_ACCESS_TOKEN === undefined){
	missing_keys = true;
	console.log("Error: You must define the TWITTER_ACCESS_TOKEN environment variable to connect to Twitter");
}
if (process.env.TWITTER_ACCESS_TOKEN_SECRET === undefined){
	missing_keys = true;
	console.log("Error: You must define the TWITTER_ACCESS_TOKEN_SECRET environment variable to connect to Twitter");
}

if (missing_keys){
	console.log("\nEither add the variables to the shell or run npm start with the variable definitions in front:\n")
	console.log("$ ENV_VAR=foobar npm start\n");

	process.exit();
}

var twit = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


// this holds all the tags that filter the twitter stream
var tags = [];

// this gets called when this file is included,
// when the server starts
getTagsAndStartStream();

// tags are updated when there's a POST to /battles/create
updateEmitter.on('update_tags', getTagsAndStartStream);

// grabs all the tags from our battles
function getTagsAndStartStream(){
	tags = [];
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
var twit_stream;
function startStreamCapture(){
	
	if (twit_stream !== undefined){
		twit_stream.stop();
	}

	twit_stream = twit.stream('statuses/filter', {track: tags});

	twit.get('search/tweets', { q: 'banana since:2011-11-11', count: 5 }, function(err, data, response) {
  		if (err){
  			console.log('Error getting data from twitter: ');
  			console.log(err);
  			process.exit();
  		}
	});

	twit_stream.on('tweet', function(tweet){
		tweet.entities.hashtags.forEach(updateCorrespondingBattle);
	});

	twit_stream.on('limit', function(msg){
		console.log(msg);
	});

	twit_stream.on('warning', function(msg){
		console.log(msg);
	});

	twit_stream.on('disconnect', function(m){
		console.log(m);
	})
}

// this updates the battles if the hashtag
// object matches the battle tag. We then
// emit an event, which tells socket.io
// to push the battle to the client
function updateCorrespondingBattle(hashtagObject){
	var hashtag = '#' + hashtagObject.text.toLowerCase();

	if (tags.indexOf(hashtag) !== -1){

		Battle.find( { $or: [ {tag1: hashtag}, {tag2: hashtag} ] }, function(err, battles){
			battles.forEach(function(battle){
				if (battle.tag1 === hashtag){
					battle.tag1_count++;
				}
				if (battle.tag2 === hashtag){
					battle.tag2_count++;
				}
				battle.save(function(err, battle, count){
					updateEmitter.emit('battle_update', battle);
				});
			});
		});
	}
}


module.exports = updateEmitter;