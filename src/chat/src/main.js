const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:3001');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

let authed = 0;
let connected = false;

function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : null, line];
}

function checkConnection() {
  if (connected) return Promise.resolve([true, 'Connection works!']);
  return new Promise((resolve) => {
    socket.on('error', (e) => {
      connected = false;
      // eslint-disable-next-line prefer-promise-reject-errors
      resolve([false, `${e.code} ERROR. I'm leaving...`]);
    });
    socket.on('open', () => {
      connected = true;
      resolve([true, 'Connection works!']);
    });
  });
}

function checkCompletions(line) {
  const exit = () => {
    console.log('Goodbye...');
    process.exit(0);
  };
  switch (line) {
    case ('.help'): console.log('Help Message'); break;
    case ('.error'): console.log('Error Message'); break;
    case ('.exit'): exit(); break;
    case ('.quit'): exit(); break;
    case ('.q'): exit(); break;
    default: console.log('Nice');
  }
}

function isAuthenticated() {
  authed += 1;
  if (authed === 2) return true;
  return false;
  //   const request = { actionName: 'isAuthenticated' };
  //   socket.send(request);
  // MAKE authchecking with HTTP
  // think what to move to HTTP protocol

  // const response = await asyncCatchEvent('message');
  // //send request to server
  // return true;
}

function acceptMessage() {
  socket.on('message', (data) => {
    // rl.write(`\n${data}`);
    // rl.write('', { ctrl: true, name: 'u' });
    console.log(data);
  });
}

function asyncQuestion(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (line) => {
      resolve(line);
    });
  });
}

// eslint-disable-next-line no-unused-vars
function asyncCatchEvent(event) {
  return new Promise((resolve) => {
    socket.on(event, (input) => {
      resolve(input.data);
    });
  });
}

// eslint-disable-next-line no-unused-vars
async function asyncSendData(data) {
  return socket.send(data);
}

function authUser() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    rl.question('1. Login\n2. Sign Up\n', async (line) => {
      if (line === '1') {
        const login = await asyncQuestion('Login: ');
        const password = await asyncQuestion('Password: ');
        const creds = {
          actionName: 'addUser',
          body: {
            username: login,
            password,
          },
        };
        socket.send(JSON.stringify(creds));
        resolve(true);
      }
    });
  });
}

function readInputMessage() {
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
  // .catch((e) => {
  //   if (!e[0]) {
  //     console.log('Error...');
  //     process.exit(1);
  //   }
  // });
  checkConnection()
    .then((connectionStatus) => {
      console.log(connectionStatus[1]);
      if (!connectionStatus[0]) process.exit(1);
      if (!isAuthenticated()) {
        authUser()
          .then((status) => {
            console.log(status);
            // eslint-disable-next-line no-unused-expressions
            // status && readInputMessage();
            question();
          });
      }
    });
}
console.log('Welcome, my friend!');
readInputMessage();
acceptMessage();

// socket.onmessage = (event) => {
//     const message = event.data.split(':'[1]);
//     //console.log(`message: ${event.data}`);
// }
