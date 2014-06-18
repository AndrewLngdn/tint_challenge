var mongoose = require('mongoose');
var Battle = mongoose.model('Battle');
var config = require('../config');
var Twit = require('twit');
var EventEmitter = require( "events" ).EventEmitter;
var updateEmitter = new EventEmitter();

var twit = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
});

var tags = [];

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

function startStreamCapture(){
	var stream = twit.stream('statuses/filter', {track: tags});
	// console.log(stream);
	stream.on('tweet', function(tweet){
		tweet.entities.hashtags.forEach(updateCorrespondingBattle);
	});
}

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