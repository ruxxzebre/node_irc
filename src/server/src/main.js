const WebSocket = require('ws');
const { v4: UUID } = require('uuid');
const server = new WebSocket.Server({ port: 3001 });

const users = {};

function broadcast(clientId, message) {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
	        client.send(`[${clientId}]: ${message.data.message}`);
  	    }
    });
}

function validateAction(action) {
    return !!Object.keys(Actions).filter(actionName => action === actionName).length;
}

const Actions = {
    'isAuthenticated': (ws, message) => {
        if (users.hasOwnProperty(ws.id)) {
            ws.send(true);
        } else {
            ws.send(false);
        }
        //ws.send(`[${ws.id}]: ${message}`);
        // console.log(message);
    
        // send msg to all users
        // broadcast(ws.id, message);
    },
    'message': (ws, message) => {
        broadcast(ws.id, message);
    },
    'login': (ws, message) => {

    },
    'signUp': (ws, message) => {

    },
    'anonymousLogin': (ws, message) => {
        const { data: { anonymousLogin } } = message;
        users[ws.id] = anonymousLogin;
        Actions.message(ws, anonymousLogin);
    }
}

//actions - is the same 'event' thing like in socket.io
function parseMessage(ws, message) {
    if (validateAction(message.action)) {
        const fn = Actions[message.action];
        fn(ws, message)
    };
}

server.on('connection', ws => {
    ws.id = UUID();
    
    ws.on('message', parseMessage);
});
