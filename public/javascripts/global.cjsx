# @cjsx React.DOM


# // Hierarchy 
# // BattleTable
# //		BattleInput
# //		BattleExample
# //		BattleList
# //			Battle

BATTLES = [
	{
		tag1: "#brazil", 
		tag2: "#germany", 
		tag1_count: 2676, 
		tag2_count: 2045, 
		created_at: "2014-7-8"
	},
	{
		tag1: "#worldcup", 
		tag2: "#worldcup2014", 
		tag1_count: 7, 
		tag2_count: 7, 
		created_at: "2014-6-24"
	},
	{
		tag1: "#android", 
		tag2: "#ipad", 
		tag1_count: 66820, 
		tag2_count: 42376, 
		created_at: "2014-6-24"
	},
	{
		tag1: "#coke", 
		tag2: "#pepsi", 
		tag1_count: 291, 
		tag2_count: 80, 
		created_at: "2014-6-19"
	},
];


BattleTable = React.createClass
	render: ->
		<div id='wrapper'>
			<BattleInput />
			<BattleExample />
		</div>

#<BattleList battles={this.props.battles}/>


BattleInput = React.createClass
	render: ->
		<div className='form-container'>
			<form action="/battles/create" method="post">
				<input id="hashtag1" type="text" placeholder="enter first hashtag" name="tag1" />
				<input id="hashtag2" type="text" placeholder="enter second hashtag" name="tag2" />
			</form>
		</div>

BattleExample = React.createClass
	render: ->
		<ul className='battle-list'>
			<li className="battle example">
				<div className='battle-text'>
					<div className='tag1-container'>
						<div className="tag1">#brand</div>
						<div className="tag1-count">Count of tags on Twitter</div>
					</div>
					<div className='tag2-container'>
						<div className='tag2'>#brand2</div>
						<div className='tag2-count'>Count of tags on Twitter</div>
					</div>
					<div className='date-created'>created since this date</div>
				</div>
			</li>
		</ul>


 # ul.battle-list
 #   li.battle.example
 #     .battle-text
 #       .tag1-container
 #         .tag1 #brand1
 #         .tag1-count Count of tags on twitter
 #       .tag2-container
 #         .tag2 #brand2
 #         .tag2-count Count of tags on twitter
 #       .date-created since this date
	

$(document).ready ->
	console.log(document.getElementById("#wrapper"));
	React.renderComponent(<BattleTable battles={BATTLES} />, document.body);


#   // #wrapper
#   //   .form-container
#   //     form(action="/battles/create" method="post")
#   //       input#hashtag1(type='text', placeholder='enter first hashtag', name='tag1')
#   //       input#hashtag2(type='text', placeholder='enter second hashtag', name='tag2')
#   //       input.hidden-submit(type='submit')
# 
# 
# // $(document).ready(function(){
# // 	// get our battle list from the server
# // 	// populateBattleList();
# // 	// initializeSocketIOServer();
# 
# // 	// click handlers
# // 	$(document).on('click', 'div.delete-text', deleteBattle);
# // });
# 
# 
# // // functions for setting up the page the first time
# // function populateBattleList(){
# 
# // 	$.get('/battles', function(battles){
# // 		$.each(battles, function(id, battle){
# // 			$('.battle-list').append(battleTemplate(battle));
# 
# // 			var $battle = $('#' + battle._id);
# // 			$battle.find('.tag1-count').text(battle.tag1_count);
# // 			$battle.find('.tag2-count').text(battle.tag2_count);
# 
# // 			if (battle === undefined){
# // 				console.log('battle is undefined in populate list');
# // 			}
# // 			updateRatioBar(battle);
# // 		})	
# // 	})
# // }
# 
# // // updates canvas ratio bar to reflect tag count
# // function updateRatioBar(battle){
# // 	var $battle = $('#' + battle._id);
# 
# 
# // 	var left_count = battle.tag1_count;
# // 	var right_count = battle.tag2_count;
# // 	var left_size = 300*(left_count/(left_count+right_count));
# // 	var right_size = 300-left_size;
# // 	var canvas = $battle.find('canvas').get(0);
# // 	if (canvas !== undefined && canvas.getContext) {
# // 		var ctx = canvas.getContext('2d');
# // 		if (left_count === 0 && right_count === 0){
# // 			ctx.fillStyle = "grey";
# // 			ctx.fillRect(0,0, 300, 300);
# // 		} else {
# // 			ctx.fillStyle = "rgb(247, 132, 8)";
# // 			ctx.fillRect(0,0, left_size, 300);
# // 			ctx.fillStyle = "rgb(8, 180, 247)";
# // 			ctx.fillRect(left_size,0, 300, 300);
# // 		}
# // 	}	
# // }
# 
# // // functions for live updating
# // function initializeSocketIOServer(){
# // 	var server = io.connect();
# 
# // 	server.on('battle_update', function(battle){
# // 		if (battle === undefined){
# // 			console.log('battle is undefined in server update');
# // 		}
# // 		updateBattleCount(battle);
# // 	});
# // }
# 
# // function updateBattleCount(battle){
# // 	var $battle = $('#' + battle._id);
# // 	$battle.find('.tag1-count').text(battle.tag1_count);
# // 	$battle.find('.tag2-count').text(battle.tag2_count);
# // 	updateRatioBar(battle);
# // }
# 
# // // delete click handler
# // function deleteBattle(event){
# 
# // 	var battle_id = $(event.target).parents('li.battle').attr('id');
# // 	$.ajax({
# // 		type: 'DELETE',
# // 		url: '/battles/delete/' + battle_id
# // 	}).done(function(){
# // 		$('#' + battle_id).remove();
# // 	});
# // }
# 
# 
# // // battle li template function
# // function battleTemplate(battle){
# // 	var battleHTML = "";
# // 	battleHTML += "<li class='battle' id='" + battle._id + "'>";
# // 	battleHTML += "     <div class='battle-text'>";
# // 	battleHTML += "         <div class='tag1-container'>";
# // 	battleHTML += "             <div class='tag1'>" + battle.tag1 + "</div>";
# // 	battleHTML += "             <div class='tag1-count'>" + battle.tag1_count + "</div>";
# // 	battleHTML += "         </div>";
# // 	battleHTML += "         <div class='tag2-container'>";
# // 	battleHTML += "             <div class='tag2'>" + battle.tag2 + "</div>";
# // 	battleHTML += "             <div class='tag2-count'>" + battle.tag2_count + "</div>";
# // 	battleHTML += "         </div>";
# // 	battleHTML += "         <div class='date-created'>";
# // 	battleHTML += "             " + battle.created_at;
# // 	battleHTML += "             <div class='delete-text'>delete</div>"
# // 	battleHTML += "         </div>";
# // 	battleHTML += "    </div>";
# // 	battleHTML += "    <canvas class='ratio' id='canvas-" + battle._id + "'></canvas>"
# // 	battleHTML += "</div>";
# 
# // 	return battleHTML;
# // }
# 
# 
# 
# 
# 
# 