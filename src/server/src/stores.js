// const MicroEvent = require('micro-event');
const { Dispatcher } = require('./actions');

const AppDispatcher = new Dispatcher();

const Stores = {
  users: {},
  messages: [],
};
// MicroEvent.mixin(Stores.users);

// Users store
AppDispatcher.register('addUser', (payload) => {
  const { id, username } = payload;
  Stores.users[id] = username;
});
AppDispatcher.register('removeUser', (payload) => {
  const { id } = payload;
  const newUsers = Object.keys(Stores.users).filter((userID) => id !== userID);
  Stores.users = newUsers;
});

// Messages store
AppDispatcher.register('message', (payload) => {
  const { id, message } = payload;
  Stores.messages.push({ id, message });
});

module.exports = Stores;
module.exports.AppDispatcher = AppDispatcher;
// eslint-disable-next-line no-unused-vars
// AppDispatcher.register('changeUsername', (payload) => {
// here we change username
// payload();
// });
