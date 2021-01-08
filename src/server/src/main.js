const WebSocket = require('ws');
const { v4: UUID } = require('uuid');
const express = require('express');
const cors = require('cors');
const Stores = require('./stores');
const { AppDispatcher } = require('./stores');
require('dotenv').config();

const { PORT: port } = process.env;

const app = express();
const server = new WebSocket.Server({ port });
const userID = UUID();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST'],
  // allowedHeaders: ['"Content-Type", "Authorization"'],
  allowedHeaders: ['*'],
}));

app.get('/authenticate', (req, res) => {
  // eslint-disable-next-line no-prototype-builtins
  if (req.query.hasOwnProperty('username')) {
    AppDispatcher.dispatch({
      actionName: 'addUser',
      body: {
        id: userID,
        username: req.query.username,
      },
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.get('/isauthed', (req, res) => {
  // eslint-disable-next-line no-prototype-builtins
  if (req.query.hasOwnProperty('username')) {
    const { length } = Object.values(Stores.users).filter((value) => value === req.query.username);
    res.send(!!length);
  } else {
    res.send(400);
  }
});

app.listen('3002', () => {
  console.log(`Listeting on ${'3002'}`);
});

const broadcast = function (clientId, message) {
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.id !== clientId) {
      // && client.id !== clientId
      const resultMessage = `[${Stores.users[clientId]}]: ${message}`;
      client.send(resultMessage);
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
  ws.id = userID;
  ws.on('message', (json) => {
    const data = JSON.parse(json);
    data.body.id = ws.id;
    AppDispatcher.dispatch(data);
    if (data.actionName === 'addUser') broadcast(ws.id, `${data.body.username} CONNECTED...`);
    else if (data.actionName === 'message') broadcast(ws.id, data.body.message);
  });
});
