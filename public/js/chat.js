const socket = io.connect('http://192.168.1.180:8080');
const history = document.getElementById('history');
const inputBox = document.getElementById('input-box');
const message = document.getElementById('message');

//Entrata in chat
const name = prompt('Benvenuto/a! Come ti chiami?');
newMessage('Ti sei connesso/a alla chat');
socket.emit('new-user', name);

//Messaggio inviato
socket.on('chat-message', function(data) {
    newMessage(`${data.name}: ${data.message}`);
});

//Utente connesso
socket.on('user-connected', name => {
    newMessage(`${name} si è unito alla chat`);
});

//Utente disconnesso
socket.on('user-disconnected', function(name) {
    newMessage(`${name} ha lasciato la chat`);
});

//Abilito l'input-box all'invio dei messaggi
inputBox.addEventListener('submit', function (event) {
    event.preventDefault();
    const text = message.value;
    newMessage(`Tu: ${text}`);
    socket.emit('send-message', text);
    message.value = '';
});

//Nuovi messaggi
function newMessage(mex) {
    const nuoviMessaggi = document.createElement('div');
    nuoviMessaggi.innerText = mex;
    history.append(nuoviMessaggi);
}