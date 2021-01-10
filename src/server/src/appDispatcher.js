// TODO: fix some bug with import order
const { Actions } = require('./stores');
const { Dispatcher } = require('./actions');

const AppDispatcher = new Dispatcher();

// Users store
AppDispatcher.register('addUser', Actions.addUser);
AppDispatcher.register('removeUser', Actions.removeUser);
AppDispatcher.register('changeUsername', Actions.changeUsername);

// Messages store
AppDispatcher.register('message', Actions.message);

module.exports = AppDispatcher;
