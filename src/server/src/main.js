const WebSocket = require('ws');
const { v4: UUID } = require('uuid');
const server = new WebSocket.Server({ port: 3001 });

function broadcast(clientId, message) {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
	    client.send(`[${clientId}]: ${message}`);
  	} 
    });
}

server.on('connection', ws => {
    ws.id = UUID();
   
    ws.on('message', message => {
        //ws.send(`[${ws.id}]: ${message}`);
	console.log(message);
        broadcast(ws.id, message);
    });
});
