var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Battle = mongoose.model('Battle');

/* GET users listing. */
router.get('/', function(req, res) {
  Battle.find(function(err, battles, count){
  	console.log(battles);
  	res.render('index', {
  		battles: battles

  	})
  })
});

router.post('/create', function(req, res){
	console.log(req.body);
	new Battle({
		tag1: req.body.tag1,
		tag1_count: 0,
		tag2: req.body.tag2,
		tag2_count: 0
	}).save(function(err, battle, count){
		console.log("error: " + err);
		console.log("battle: " + battle);
		res.redirect('/battles');
	})
});

module.exports = router;