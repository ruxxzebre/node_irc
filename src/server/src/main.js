const WebSocket = require('ws');
const { v4: UUID } = require('uuid');
const Stores = require('./stores');
const { AppDispatcher } = require('./stores');
require('dotenv').config();

const { PORT: port } = process.env;

const server = new WebSocket.Server({ port });

const broadcast = function (clientId, message) {
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log(message);
      client.send(`[${Stores.users[clientId]}]: ${message}`);
    }
  });
};
broadcast.bind({ server });

// actions - is the same 'event' thing like in socket.io
// function parseMessage(ws, message) {
//   if (validateAction(message.action)) {
//     const fn = Actions[message.action];
//     fn(ws, message);
//   };
// }

server.on('connection', (ws) => {
  // TODO: input validation
  // TODO: validate manipulations with users store
  // eslint-disable-next-line no-param-reassign
  ws.id = UUID();
  ws.on('message', (json) => {
    const data = JSON.parse(json);
    data.body.id = ws.id;
    AppDispatcher.dispatch(data);
    if (data.actionName === 'addUser') broadcast(ws.id, `${data.body.username} CONNECTED...`);
    else if (data.actionName === 'message') broadcast(ws.id, data.body.message);
  });
});
