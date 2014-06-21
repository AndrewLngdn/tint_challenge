var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Battle = mongoose.model('Battle');
var updateEmitter = require('../lib/twitter-capture');


/* GET users listing. */
router.get('/', function(req, res) {
  Battle.find(function(err, battles, count){
	  res.send(battles.reverse());
  })
});

// creates new battles. Happens when a user
// inputs two tags on the index page
router.post('/create', function(req, res){
 	var d = new Date();
    var curr_date = d.getDate(); // -1 for testing
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();

	new Battle({
		tag1: req.body.tag1,
		tag1_count: 0,
		tag2: req.body.tag2,
		tag2_count: 0,
		created_at: curr_year + "-" + curr_month + "-" + curr_date
	}).save(function(err, battle, count){
		res.redirect('/');
		// everytime a new battle is added, update the tags on
		// our twitter stream
		updateEmitter.emit('update_tags');
	});
});

router.delete('/delete/:id', function(req, res){
	var battle_id = req.params.id;
	Battle.findById(battle_id, function(err, battle){
		if (err){
			console.log('error ' + err);
			res.send(err);	
		} else {
			battle.remove();
			res.send('');
		}
	});
});


module.exports = router;