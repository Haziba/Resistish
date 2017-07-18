// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.use('/', express.static(__dirname + '/node_modules'));
app.use('/js', express.static(__dirname + '/shared'));
app.use('/', express.static(__dirname + '/public'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

require('./shared/pubsub.js');

require('./socket.js')(server);

require('./game.js');

server.listen(4200);

//*** GAME ***//
