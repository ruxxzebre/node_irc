const got = require('got');
const WebSocket = require('ws');
require('dotenv').config();

const { SOCKET_URL, SOCKET_PORT, API_URL, API_PORT } = process.env;
const TEST_USERNAME = 'test';
let socket;

beforeAll(async () => {
  require('../rest');
  const url = `${API_URL}:${API_PORT}/authenticate?username=${TEST_USERNAME}`;
  // auth
  const { body: id } = await got(url);
  // socket
  require('../socket');
  socket = new WebSocket(`${SOCKET_URL}:${SOCKET_PORT}`);
  // assigning id to socket connection
  socket.send({ actionName: 'recordID', body: { id } });
});

test('Send message',async () => {
  // socket.send({ actionName: 'message', body: { id, message } })
});
