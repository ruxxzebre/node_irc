const got = require('got');
const WebSocket = require('ws');
require('dotenv').config();

const { SOCKET_URL, SOCKET_PORT, API_URL, API_PORT } = process.env;
const TEST_USERNAME = 'test';

// When started, tests are adding rows to appropriate Stores.
test('Authorize to API.', async () => {
  // run REST server
  require('../rest');
  const url = `${API_URL}:${API_PORT}/authenticate?username=${TEST_USERNAME}`;
  const { body } = await got(url);
  expect(typeof body === "string").toBe(true);
});

test('Socket connection.', async () => {
  // run socket server
  require('../socket');
  // connection
  const socket = new WebSocket(`${SOCKET_URL}:${SOCKET_PORT}`);
  socket.on('message', (message) => {
    expect(message).toBe('Connected!');
  });
});

test('Connection approval.', async () => {
  // run socket server
  require('../socket');
  // connection
  const socket = new WebSocket(`${SOCKET_URL}:${SOCKET_PORT}`);

  socket.on('message', (message) => {
    expect(message).toBe('Connected!');
  });
});
