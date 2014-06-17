var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Battle = mongoose.model('Battle');




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