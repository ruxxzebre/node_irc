const EventEmitter = require('events');

class Dispatcher extends EventEmitter {
  constructor(actions) {
    super();
    this.setActions(actions && []);
  }

  dispatch(data) {
    const { actionName, item } = data;
    this.emit(actionName, item);
  }

  register(actionName, fn) {
    this.on(actionName, fn);
  }

  setActions(actions) {
    this.actions = actions;
  }

  setSingleAction(action) {
    this.actions.push(action);
  }
}

module.exports = { Dispatcher };
