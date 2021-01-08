require('dotenv').config();

const { authUser } = require('./api');
const runSocket = require('./socket');

authUser()
  .then((id) => {
    if (id) runSocket(id);
  });
// let connected = false;

// // eslint-disable-next-line no-unused-vars
// function asyncCatchEvent(event) {
//   return new Promise((resolve) => {
//     socket.on(event, (input) => {
//       resolve(input.data);
//     });
//   });
// }

// // eslint-disable-next-line no-unused-vars
// async function asyncSendData(data) {
//   return socket.send(data);
// }

// socket.onmessage = (event) => {
//     const message = event.data.split(':'[1]);
//     //console.log(`message: ${event.data}`);
// }
