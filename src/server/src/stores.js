const EventMixin = require('./eventMixin');
const { Dispatcher } = require('./actions');
// const { extendObject } = require('./helpers');

const AppDispatcher = new Dispatcher();

const Stores = {
  users: {},
  messages: [],
};

EventMixin(Stores.users);
EventMixin(Stores.messages);
// extendObject(Stores.users, usersCrudMixin);
// extendObject(Stores.messages, messagesCrudMixin);

const Actions = {
  addUser: (payload) => {
    console.log(Stores);
    const { id, username } = payload;
    Stores.users[id] = username;
    const userAdded = {
      actionName: 'userAdded',
      body: { id, message: `${username} is connected! Say hello to him!` },
    };
    Stores.users.trigger(userAdded);
  },
  message: (payload) => {
    const { id, message } = payload;
    Stores.messages.push({ id, message });
    Stores.messages.trigger({ actionName: 'message', body: payload });
  },
  removeUser: (payload) => {
    // TODO: implement user removal
    console.log(payload);
    // const { id } = payload;
    // const newUsers = Object.keys(Stores.users).filter((userID) => id !== userID);
    // Stores.users = newUsers;
  },
  changeUsername: (payload) => {
    // TODO: implement username changing
    console.log(payload);
  },
};

Stores.users.on('userAdded', (payload) => {
  const { id, message } = payload;
  AppDispatcher.dispatch({
    actionName: 'broadcast',
    body: { id, message },
  });
});

Stores.messages.on('message', (payload) => {
  const { id, message } = payload;
  AppDispatcher.dispatch({
    actionName: 'broadcast',
    body: { id, message },
  });
});

// Users store
AppDispatcher.register('addUser', Actions.addUser);
AppDispatcher.register('removeUser', Actions.removeUser);
AppDispatcher.register('changeUsername', Actions.changeUsername);

// Messages store
AppDispatcher.register('message', Actions.message);

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line arrow-body-style
const findUser = (userCredential, id = false) => {
  return Stores.users.find((user) => userCredential === (id ? user.id : user.username));
};

module.exports = Stores;
module.exports.Actions = Actions;
module.exports.AppDispatcher = AppDispatcher;
module.exports.findUser = findUser;
