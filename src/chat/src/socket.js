const WebSocket = require('ws');
const prompt = require('prompt');
const { readInputMessage } = require('./rl');

prompt.message = '';

const runSocket = (id) => {
  const { SOCKET_URL, SOCKET_PORT } = process.env;
  const socket = new WebSocket(`${SOCKET_URL}:${SOCKET_PORT}`);

  socket.on('open', () => {
    console.log('Yeeet! Connected!');
    socket.send(JSON.stringify({
      actionName: 'recordID',
      body: { id },
    }));
  });

  socket.on('close', () => {});

  socket.on('error', (err) => {
    console.log(`'Trouble with socket. ERRMSG: '${err.message}`);
    process.exit(1);
  });

  socket.on('message', (data) => {
    // rl.write(`\n${data}`);
    // rl.write('', { ctrl: true, name: 'u' });
    console.log(data);
  });

  readInputMessage((req) => socket.send(req));
};

module.exports = runSocket;
