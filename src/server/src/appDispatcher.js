// TODO: fix some bug with import order
const Stores = require('./stores');
const { Dispatcher } = require('./actions');

const AppDispatcher = new Dispatcher();

// Users store
AppDispatcher.register('addUser', (payload) => {
  console.log(Stores);
  const { id, username } = payload;
  Stores.users[id] = username;
  const userAdded = {
    actionName: 'userAdded',
    body: { id, message: `${username} is connected! Say hello to him!` },
  };
  Stores.users.trigger(userAdded);
});
AppDispatcher.register('removeUser', (payload) => {
  // TODO: implement user removal
  console.log(payload);
  // const { id } = payload;
  // const newUsers = Object.keys(Stores.users).filter((userID) => id !== userID);
  // Stores.users = newUsers;
});
AppDispatcher.register('changeUsername', (payload) => {
  // TODO: implement username changing
  console.log(payload);
});

// Messages store
AppDispatcher.register('message', (payload) => {
  const { id, message } = payload;
  Stores.messages.push({ id, message });
  Stores.messages.trigger({ actionName: 'message', body: payload });
});

// // Stores actions (that only stores can use)
// AppDispatcher.register('broadcast', (payload) => {
//   const { id, message } = payload;
//   broadcast(id, message);
// });

module.exports = AppDispatcher;
