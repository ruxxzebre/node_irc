const WebSocket = require('ws');
const { completer, checkCompletions } = require('./commands');
const { rl } = require('./rl');

const runSocket = (id) => {
  const { SOCKET_URL } = process.env;
  const socket = new WebSocket(SOCKET_URL);

  // eslint-disable-next-line no-unused-vars
  function connectSocket() {
    return new Promise((resolve) => {
      socket.onopen(() => {
        resolve(true);
      });
    });
  }

  socket.on('open', () => {
    socket.send(JSON.stringify({
      actionName: 'recordID',
      body: {
        id,
      },
    }));
  });

  function checkConnection() {
    return [true, 'chill'];
    //   if (connected) return Promise.resolve([true, 'Connection works!']);
    //   return new Promise((resolve) => {
    //     socket.on('error', (e) => {
    //       connected = false;
    //       // eslint-disable-next-line prefer-promise-reject-errors
    //       resolve([false, `${e.code} ERROR. I'm leaving...`]);
    //     });
    //   });
  }

  function acceptMessage() {
    socket.on('message', (data) => {
    // rl.write(`\n${data}`);
    // rl.write('', { ctrl: true, name: 'u' });
      console.log(data);
    });
  }

  async function readInputMessage() {
    const question = () => {
      rl.question('[YOU]: ', (message) => {
        const command = completer(message);
        if (command[0]) checkCompletions(command[1]);
        socket.send(JSON.stringify({
          actionName: 'message',
          body: { message },
        }));
        question();
      });
    };
    const connectionStatus = await checkConnection();
    if (!connectionStatus[0]) {
      console.log('Trouble with socket...');
      process.exit(1);
    }
    console.log('Yeeet! Connected!');
    question();
  }
  console.log('Welcome, my friend!');
  readInputMessage();
  acceptMessage();
};

module.exports = runSocket;
