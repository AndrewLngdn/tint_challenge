var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Battle = mongoose.model('Battle');
var config = require('../config');
var Twit = require('twit');

var twit = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
});


Battle.find(function(err, battles, count){
	var tags = [];
	battles.forEach(function(battle){
		if (tags.indexOf(battle.tag1) === -1){
			tags.push(battle.tag1);
		}
		if (tags.indexOf(battle.tag2) === -1){
			tags.push(battle.tag2);
		}
	});

	var stream = twit.stream('statuses/filter', {track: tags});
	console.log(stream);
	stream.on('tweet', function(tweet){
		console.log('---------------------')
		console.log(tweet.entities.hashtags);
		console.log('---------------------')
		tweet.entities.hashtags.forEach(function(hashtagObject){
			if (tags.indexOf('#' + hashtagObject.text.toLowerCase()) !== -1){

				Battle.find({tag1: '#'+hashtagObject.text}, function(err, battles){
					battles.forEach(function(battle){
						battle.tag1_count++;
						battle.save();
						console.log('updating battle!!! ------');
						console.log(battle);
						console.log('done!!!! ----------------');

					});
				});

				Battle.find({tag2: '#'+hashtagObject.text}, function(err, battles){
					battles.forEach(function(battle){
						battle.tag2_count++;
						battle.save();
						console.log('updating battle!!! ------');
						console.log(battle);
						console.log('done!!!! ----------------');
					});
				});
			}
		});

	});
});


/* GET users listing. */
router.get('/', function(req, res) {
  Battle.find(function(err, battles, count){
  	res.render('index', {
  		battles: battles.reverse()
  	});
  })
});

router.post('/create', function(req, res){
 	var d = new Date();
    var curr_date = d.getDate() - 1; // -1 for testing
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
	new Battle({
		tag1: req.body.tag1,
		tag1_count: 0,
		tag2: req.body.tag2,
		tag2_count: 0,
		created_at: curr_year + "-" + curr_month + "-" + curr_date
	}).save(function(err, battle, count){
		console.log("error: " + err);
		console.log("battle: " + battle);
		res.redirect('/battles');
	})
});

module.exports = router;