var battlesObject = {};

$(document).ready(function(){
	
	$.get('/battles', function(battles){
		console.log(battles);
		battles.forEach(function(battle){
			battlesObject[battle._id] = battle;
		})
		addBattlesToPage();
	})



	var server = io.connect('http://localhost:3000');

	server.on('battle_update', function(battle){
		// console.log('getting update');
		battlesObject[battle._id] = battle;
		updateBattleList(battle);
	})
	$(document).on('click', 'div.delete-text', deleteBattle);
});

function deleteBattle(event){
	var battle_id = $(event.target).parents('li.battle').attr('id');
	$.ajax({
		type: 'DELETE',
		url: '/battles/delete/' + battle_id
		// url: '/battles/delete'
	});

}

function updateBattleList(battle){
	var $battle = $('#' + battle._id)
	$battle.replaceWith(battleTemplate(battle));
}

function addBattlesToPage(){
	$.each(battlesObject, function(id, battle){
		$('.battle-list').append(battleTemplate(battle));
	})	
}

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