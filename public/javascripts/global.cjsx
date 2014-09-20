# @cjsx React.DOM


# // Hierarchy 
# // BattleTable
# //		BattleInput
# //		BattleList
# //			BattleExample
# //			Battle



BattleTable = React.createClass
	getInitialState: ->
		{battles:[]}
	componentDidMount: ->
		this.loadBattles()
		this.initializeSocketIO()

		return
	loadBattles: ->
		$.ajax({
			type: 'GET'
			url: this.props.battleUrl,
			dataType: 'json',
			success: ((battles) ->
				this.setState({battles: battles})
				return
			).bind(this),
			error: ((xhr, status, err) ->
				console.error(this.props.notesUrl, status, err.toString());
				return
			).bind(this)
		})
		return
	initializeSocketIO: ->
		this.props.server.on('battle_update', this.updateBattle)
		return

	updateBattle: (battle) ->
		battles = this.state.battles
		battle_arr = $.grep(battles, (b)->
			return (b._id is battle._id)
		)
		if battle_arr.length == 1
			old_battle = battle_arr[0]
			index = battles.indexOf(battle_arr[0])
			battles[index] = battle
			this.setState({battles:battles})
		return

	formatBattleObj: (battle_tags)->
		d = new Date()
		curr_date = d.getDate()
		curr_month = d.getMonth() + 1
		curr_year = d.getFullYear()

		battle = {
			tag1: battle_tags.tag1,
			tag2: battle_tags.tag2,
			tag1_count: 0,
			tag2_count: 0,
			created_at: curr_year + "-" + curr_month + "-" + curr_date
		}
	handleSubmit: (battle_tags)->
		battles = this.state.battles
		battle = this.formatBattleObj(battle_tags)
		this.postToServer(battle)
		return
	deleteBattle: (battle_id) ->
		battles = this.state.battles
		battle_arr = $.grep(battles, (b)->
			return (b._id is battle_id)
		)
		if battle_arr.length == 1
			index = battles.indexOf(battle_arr[0])
			battles.splice(index, 1)

		this.setState({battles: battles})

		$.ajax({
			type: 'DELETE',
			url: '/battles/delete/' + battle_id
		})
		return

	postToServer: (battle)->
		$.ajax({
			url: this.props.battleUrl + '/create',
			dataType: 'json', 
			type: 'POST',
			data: battle,
			success: ((battle_id)->
				battles = this.state.battles
				battle._id = battle_id
				battles.unshift(battle)
				this.setState({battles: battles})
				return

			).bind(this),
			error: ((xhr, status, err) ->
				console.error(this.props.battleUrl, status, err.toString())
				return
			).bind(this)
		})


	render: ->
		<div id='wrapper'>
			<BattleInput onSubmit={this.handleSubmit}/>
			<BattleList battles={this.state.battles} handleDelete={this.deleteBattle}/>
		</div>

BattleInput = React.createClass
	handleSubmit: (e)->
		e.preventDefault()
		tag1 = this.refs.tag1.getDOMNode().value.trim()
		tag2 = this.refs.tag2.getDOMNode().value.trim()
		this.props.onSubmit {tag1: tag1, tag2: tag2}
		this.refs.tag1.getDOMNode().value = ''
		this.refs.tag2.getDOMNode().value = ''
	render: ->
		<div className='form-container'>
			<form onSubmit={this.handleSubmit}>
				<input id="hashtag1" type="text" placeholder="enter first hashtag" name="tag1" ref="tag1" />
				<input id="hashtag2" type="text" placeholder="enter second hashtag" name="tag2" ref="tag2" />
				<input className='hidden-submit' type='submit' />
			</form>
		</div>


BattleExample = React.createClass
	render: ->
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

BattleList = (BattleList = React).createClass
	render: ->
		battleNodes = this.props.battles.map ((battle) ->
			<Battle handleDelete={this.props.handleDelete}  battle={battle} />
			).bind(this)
		<ul className='battle-list'>
			<BattleExample />
			{battleNodes}
		</ul>


Battle = (Battle = React).createClass
	handleDelete: (battle_id)->
		this.props.handleDelete(this.props.battle._id)
		return
	render: ->
		battle = this.props.battle;
		canvasId = 'canvas-' + battle._id
		if !battle._id then battle._id = ''
		<li className="battle" id={battle._id}>
			<div className='battle-text'>
				<div className='tag1-container'>
					<div className="tag1">{battle.tag1}</div>
					<div className="tag1-count">{battle.tag1_count}</div>
				</div>
				<div className='tag2-container'>
					<div className='tag2'>{battle.tag2}</div>
					<div className='tag2-count'>{battle.tag2_count}</div>
				</div>
				<div className='date-created'>
					{battle.created_at}
					<div className='delete-text' onClick={this.handleDelete}>delete</div>
				</div>
				<canvas className='ratio' id={canvasId} /> 
			</div>
		</li>


$(document).ready ->
	server = io.connect()
	React.renderComponent(<BattleTable battles={BATTLES} 
										battleUrl='battles'
										server={server}/>, document.body);



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
