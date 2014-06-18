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
	battleHTML += "    <div class='date-created'>created on " + battle.created_at; ;
	battleHTML += "    <div class='delete-text'>delete </div> </div>";

	battleHTML += "</div>";

	return battleHTML;
}