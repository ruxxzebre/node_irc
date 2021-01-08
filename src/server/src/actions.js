const EventEmitter = require('events');

class Dispatcher extends EventEmitter {
  constructor(actions) {
    super();
    this.setActions(actions && []);
  }

  dispatch(data) {
    const { actionName, body } = data;
    this.emit(actionName, body);
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

module.exports.Dispatcher = Dispatcher;
