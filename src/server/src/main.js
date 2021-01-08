const WebSocket = require('ws');
const { v4: UUID } = require('uuid');

const server = new WebSocket.Server({ port: 3001 });

const users = {};

function emit(action, data) {
  const response = { action };
  if (data.constructor.name === 'Object') response.data = data;
  else {
    response.data = { message: data };
  }
  // ws.send(response);
}

function broadcast(clientId, message) {
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`[${clientId}]: ${message.data.message}`);
    }
  });
}

function validateAction(action) {
  return !!Object.keys(Actions).filter(actionName => action === actionName).length;
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
