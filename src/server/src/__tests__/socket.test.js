require('dotenv').config();
const { SOCKET_URL, SOCKET_PORT } = process.env;

test('Socket connection.', async () => {
  // run socket server
  require('../socket');
  const WebSocket = require('ws');
  // connection
  const socket = new WebSocket(`${SOCKET_URL}:${SOCKET_PORT}`);

  socket.on('message', (message) => {
    expect(message).toBe('Connected!');
  });
});
