var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

app.use('/', express.static('client'));

var users = {};

io.on('connection', function (socket) {
    console.log('someone connected');

    var id;

    do {
        id = (Math.random() * 10000000000000000).toFixed(0);
    } while(users.hasOwnProperty(id));

    socket.emit('nameYourself', id);
    socket.broadcast.emit('newUser', id);

    socket.on('mouse pos', function (msg) {
        socket.broadcast.emit('mouse pos', msg);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
        socket.broadcast.emit('deadUser', id);
    });
})

server.listen(3000, function () {
    console.log('Server listening on port 3000');
});