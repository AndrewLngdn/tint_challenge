$(document).ready(function(){

	// get our battle list from the server
	populateBattleList();
	initializeSocketIOServer();

	// click handlers
	$(document).on('click', 'div.delete-text', deleteBattle);
});


// functions for setting up the page the first time
function populateBattleList(){

	$.get('/battles', function(battles){
		$.each(battles, function(id, battle){
			$('.battle-list').append(battleTemplate(battle));
		})	
	})
}

// functions for live updating
function initializeSocketIOServer(){
	var server = io.connect('http://localhost:3000');

	server.on('battle_update', function(battle){
		updateBattleCount(battle);
	});
}

function updateBattleCount(battle){
	var $battle = $('#' + battle._id);
	var left_count = battle.tag1_count;
	var right_count = battle.tag2_count;
	var left_size = 300*(left_count/(left_count+right_count));
	var right_size = 300-left_size;
	var canvas = $battle.find('canvas').get(0);
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = "rgb(247, 132, 8)";
		ctx.fillRect(0,0, left_size, 100);
		ctx.fillStyle = "rgb(8, 180, 247)";
		ctx.fillRect(left_size,0, 300, 100);

	}	
	$battle.find('.tag1-count').text(battle.tag1_count);
	$battle.find('.tag2-count').text(battle.tag2_count);

}

// delete click handler
function deleteBattle(event){

	var battle_id = $(event.target).parents('li.battle').attr('id');
	$.ajax({
		type: 'DELETE',
		url: '/battles/delete/' + battle_id
	}).done(function(){
		$('#' + battle_id).remove();
	});
}


// battle li template function
function battleTemplate(battle){
	var battleHTML = "";
	battleHTML += "<li class='battle' id='" + battle._id + "'>";
	battleHTML += "    <div class='tag1-container'>";
	battleHTML += "        <div class='tag1'>" + battle.tag1 + "</div>";
	battleHTML += "        <div class='tag1-count'>" + battle.tag1_count + "</div>";
	battleHTML += "    </div>";
	battleHTML += "    <div class='tag2-container'>";
	battleHTML += "        <div class='tag2'>" + battle.tag2 + "</div>";
	battleHTML += "        <div class='tag2-count'>" + battle.tag2_count + "</div>";
	battleHTML += "    </div>";
	battleHTML += "    <div class='date-created'>";
	battleHTML += "        created on " + battle.created_at;
	battleHTML += "        <div class='delete-text'>delete</div>"
	battleHTML += "    </div>";
	battleHTML += "    <canvas class='ratio' id='canvas-" + battle._id + "'></canvas>"
	battleHTML += "</div>";

	return battleHTML;
}





