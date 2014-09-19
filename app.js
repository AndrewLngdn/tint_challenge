var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var coffeeMiddleware = require('coffee-middleware');

// sets up our battle model and connects to mongo
require('./db');

var routes = require('./routes/index');
var battles = require('./routes/battles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(coffeeMiddleware({
    src: __dirname + '/public',
    compress: true
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/battles', battles);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var debug = require('debug')('tint_challenge');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

// socket.io is used to push the battle data 
// to the browser

var io = require('socket.io').listen(server);

// when a battle gets a new count,
// tell all the clients so they can update
var updateEmitter = require('./lib/twitter-capture');

updateEmitter.on('battle_update', function(battle){
    io.sockets.emit('battle_update', battle);
});

