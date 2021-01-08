const MicroEvent = require('micro-event');
const { Dispatcher } = require('./actions');

const AppDispatcher = new Dispatcher();

const Users = {
  users: [],
};
MicroEvent.mixin(Users);
AppDispatcher.register('add', (payload) => Users.users.push(payload));
AppDispatcher.register('remove', (payload) => {
  const { username } = payload;
  const newUsers = Users.users.filter((item) => item.username !== username);
  Users.users = newUsers;
});
// eslint-disable-next-line no-unused-vars
AppDispatcher.register('changeName', (payload) => {
  // here we change username
  // payload();
});

// module.exports = ;
