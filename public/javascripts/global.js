// Generated by CoffeeScript undefined
(function() {
  var BATTLES, Battle, BattleExample, BattleInput, BattleList, BattleTable;

  BattleTable = React.createClass({
    getInitialState: function() {
      return {
        battles: []
      };
    },
    componentDidMount: function() {
      this.loadBattles();
      this.initializeSocketIO();
    },
    loadBattles: function() {
      $.ajax({
        type: 'GET',
        url: this.props.battleUrl,
        dataType: 'json',
        success: (function(battles) {
          this.setState({
            battles: battles
          });
        }).bind(this),
        error: (function(xhr, status, err) {
          console.error(this.props.notesUrl, status, err.toString());
        }).bind(this)
      });
    },
    initializeSocketIO: function() {
      this.props.server.on('battle_update', this.updateBattle);
    },
    updateBattle: function(battle) {
      var battle_arr, battles, index, old_battle;
      battles = this.state.battles;
      battle_arr = $.grep(battles, function(b) {
        return b._id === battle._id;
      });
      if (battle_arr.length === 1) {
        old_battle = battle_arr[0];
        index = battles.indexOf(battle_arr[0]);
        battles[index] = battle;
        this.setState({
          battles: battles
        });
      }
    },
    formatBattleObj: function(battle_tags) {
      var battle, curr_date, curr_month, curr_year, d;
      d = new Date();
      curr_date = d.getDate();
      curr_month = d.getMonth() + 1;
      curr_year = d.getFullYear();
      return battle = {
        tag1: battle_tags.tag1,
        tag2: battle_tags.tag2,
        tag1_count: 0,
        tag2_count: 0,
        created_at: curr_year + "-" + curr_month + "-" + curr_date
      };
    },
    handleSubmit: function(battle_tags) {
      var battle, battles;
      battles = this.state.battles;
      battle = this.formatBattleObj(battle_tags);
      this.postToServer(battle);
    },
    deleteBattle: function(battle_id) {
      var battle_arr, battles, index;
      battles = this.state.battles;
      battle_arr = $.grep(battles, function(b) {
        return b._id === battle_id;
      });
      if (battle_arr.length === 1) {
        index = battles.indexOf(battle_arr[0]);
        battles.splice(index, 1);
      }
      this.setState({
        battles: battles
      });
      $.ajax({
        type: 'DELETE',
        url: '/battles/delete/' + battle_id
      });
    },
    postToServer: function(battle) {
      return $.ajax({
        url: this.props.battleUrl + '/create',
        dataType: 'json',
        type: 'POST',
        data: battle,
        success: (function(battle_id) {
          var battles;
          battles = this.state.battles;
          battle._id = battle_id;
          battles.unshift(battle);
          this.setState({
            battles: battles
          });
        }).bind(this),
        error: (function(xhr, status, err) {
          console.error(this.props.battleUrl, status, err.toString());
        }).bind(this)
      });
    },
    render: function() {
      return React.DOM.div({
        "id": 'wrapper'
      }, BattleInput({
        "onSubmit": this.handleSubmit
      }), BattleList({
        "battles": this.state.battles,
        "handleDelete": this.deleteBattle
      }));
    }
  });

  BattleInput = React.createClass({
    handleSubmit: function(e) {
      var tag1, tag2;
      e.preventDefault();
      tag1 = this.refs.tag1.getDOMNode().value.trim();
      tag2 = this.refs.tag2.getDOMNode().value.trim();
      this.props.onSubmit({
        tag1: tag1,
        tag2: tag2
      });
      this.refs.tag1.getDOMNode().value = '';
      return this.refs.tag2.getDOMNode().value = '';
    },
    render: function() {
      return React.DOM.div({
        "className": 'form-container'
      }, React.DOM.form({
        "onSubmit": this.handleSubmit
      }, React.DOM.input({
        "id": "hashtag1",
        "type": "text",
        "placeholder": "enter first hashtag",
        "name": "tag1",
        "ref": "tag1"
      }), React.DOM.input({
        "id": "hashtag2",
        "type": "text",
        "placeholder": "enter second hashtag",
        "name": "tag2",
        "ref": "tag2"
      }), React.DOM.input({
        "className": 'hidden-submit',
        "type": 'submit'
      })));
    }
  });

  BattleExample = React.createClass({
    render: function() {
      return React.DOM.li({
        "className": "battle example"
      }, React.DOM.div({
        "className": 'battle-text'
      }, React.DOM.div({
        "className": 'tag1-container'
      }, React.DOM.div({
        "className": "tag1"
      }, "#brand"), React.DOM.div({
        "className": "tag1-count"
      }, "Count of tags on Twitter")), React.DOM.div({
        "className": 'tag2-container'
      }, React.DOM.div({
        "className": 'tag2'
      }, "#brand2"), React.DOM.div({
        "className": 'tag2-count'
      }, "Count of tags on Twitter")), React.DOM.div({
        "className": 'date-created'
      }, "created since this date")));
    }
  });

  BattleList = (BattleList = React).createClass({
    render: function() {
      var battleNodes;
      battleNodes = this.props.battles.map((function(battle) {
        return Battle({
          "handleDelete": this.props.handleDelete,
          "battle": battle
        });
      }).bind(this));
      return React.DOM.ul({
        "className": 'battle-list'
      }, BattleExample(null), battleNodes);
    }
  });

  Battle = (Battle = React).createClass({
    componentDidUpdate: function(prevProps, prevState) {
      this.updateCanvas();
    },
    updateCanvas: function() {
      var battle, canvas, ctx, left_count, left_size, right_count, right_size;
      battle = this.props.battle;
      left_count = battle.tag1_count;
      right_count = battle.tag2_count;
      left_size = 300 * (left_count / (left_count + right_count));
      right_size = 300 - left_size;
      canvas = this.refs.canvas.getDOMNode();
      if (canvas) {
        ctx = canvas.getContext('2d');
        if (left_count === 0 && right_count === 0) {
          ctx.fillStyle = "grey";
          ctx.fillRect(0, 0, 300, 300);
        } else {
          ctx.fillStyle = "rgb(247, 132, 8)";
          ctx.fillRect(0, 0, left_size, 300);
          ctx.fillStyle = "rgb(8, 180, 247)";
          ctx.fillRect(left_size, 0, 300, 300);
        }
      }
    },
    handleDelete: function(battle_id) {
      this.props.handleDelete(this.props.battle._id);
    },
    render: function() {
      var battle, canvasId;
      battle = this.props.battle;
      canvasId = 'canvas-' + battle._id;
      if (!battle._id) {
        battle._id = '';
      }
      return React.DOM.li({
        "className": "battle",
        "id": battle._id
      }, React.DOM.div({
        "className": 'battle-text'
      }, React.DOM.div({
        "className": 'tag1-container'
      }, React.DOM.div({
        "className": "tag1"
      }, battle.tag1), React.DOM.div({
        "className": "tag1-count"
      }, battle.tag1_count)), React.DOM.div({
        "className": 'tag2-container'
      }, React.DOM.div({
        "className": 'tag2'
      }, battle.tag2), React.DOM.div({
        "className": 'tag2-count'
      }, battle.tag2_count)), React.DOM.div({
        "className": 'date-created'
      }, battle.created_at, React.DOM.div({
        "className": 'delete-text',
        "onClick": this.handleDelete
      }, "delete"))), React.DOM.canvas({
        "className": 'ratio',
        "ref": 'canvas',
        "id": canvasId
      }));
    }
  });

  $(document).ready(function() {
    var server;
    server = io.connect();
    return React.renderComponent(BattleTable({
      "battles": BATTLES,
      "battleUrl": 'battles',
      "server": server
    }), document.body);
  });

  BATTLES = [
    {
      tag1: "#brazil",
      tag2: "#germany",
      tag1_count: 2676,
      tag2_count: 2045,
      created_at: "2014-7-8"
    }, {
      tag1: "#worldcup",
      tag2: "#worldcup2014",
      tag1_count: 7,
      tag2_count: 7,
      created_at: "2014-6-24"
    }, {
      tag1: "#android",
      tag2: "#ipad",
      tag1_count: 66820,
      tag2_count: 42376,
      created_at: "2014-6-24"
    }, {
      tag1: "#coke",
      tag2: "#pepsi",
      tag1_count: 291,
      tag2_count: 80,
      created_at: "2014-6-19"
    }
  ];

}).call(this);
