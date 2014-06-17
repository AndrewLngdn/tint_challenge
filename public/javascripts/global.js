$(document).ready(function(){
	var server = io.connect('http://localhost:3000');
	// console.log(server);
	server.on('battle_update', function(battle){
		console.log(battle);
	})
});