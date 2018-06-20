var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);

app.use("/static", express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
