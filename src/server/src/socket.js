const WebSocket = require('ws');
const Stores = require('./stores');
const { AppDispatcher } = require('./stores');

const { SOCKET_PORT: port } = process.env;

const server = new WebSocket.Server({ port });

const broadcast = (clientId, message) => {
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // client.id !== clientId
      const resultMessage = `[${Stores.users[clientId]}]: ${message}`;
      client.send(resultMessage);
    }
  });
};

AppDispatcher.register('broadcast', ({ clientId, message }) => broadcast(clientId, message));

server.on('connection', (ws) => {
  // TODO: FIX MESS WITH CIRCULAR DEPS
  // TODO: input validation
  // TODO: validate manipulations with users store
  // TODO: if no id passed,
  // or it's not found in store -> close connection and throw a description message
  // TODO: add some kind of `permission system` for users
  ws.on('message', (json) => {
    const data = JSON.parse(json);
    if (data.actionName === 'recordID') {
      // eslint-disable-next-line no-param-reassign
      ws.id = data.body.id;
    } else {
      data.body.id = ws.id;
      AppDispatcher.dispatch(data);
    }
  });
});

module.exports.broadcast = broadcast;
