const http = require('http');
const express = require('express');
const app = express();

//Carico la cartella coi file statici
app.use(express.static(__dirname + '/public'));

//Imposto il routing e setto ejs come view engine
app.set('view-engine', 'ejs');

//Welcome page
app.get('/', function (req, res) {
    res.render('index.ejs');
});

const server = http.createServer(app);

//Array che registra gli utenti connessi
const userlist = {};

const io = require('socket.io').listen(server);

io.on('connection', function(socket) {
    console.log("Nuovo visitatore connesso!");

    //Messaggio in chat
    socket.on('send-message', function(message) {
        socket.broadcast.emit('chat-message', { message: message, name: userlist[socket.id] });
    });

    //Connessione di un nuovo utente
    socket.on('new-user', function(name) {
        userlist[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });

    //Un utente si disconnette
    socket.on('disconnect', function() {
        socket.broadcast.emit('user-disconnected', userlist[socket.id]);
        delete userlist[socket.id];
    });
});

server.listen(8080);