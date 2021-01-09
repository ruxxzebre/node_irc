const EventMixin = require('./eventMixin');
const { broadcast } = require('./socket');

const Stores = {
  users: {},
  messages: [],
};

EventMixin(Stores.users);
EventMixin(Stores.messages);

Stores.users.on('userAdded', (payload) => {
  const { id, message } = payload;
  broadcast(id, message);
});

Stores.messages.on('message', (payload) => {
  const { id, message } = payload;
  broadcast(id, message);
});

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line arrow-body-style
const findUser = (userCredential, id = false) => {
  return Stores.users.find((user) => userCredential === (id ? user.id : user.username));
};

module.exports = Stores;
module.exports.storeHelpers = findUser;
