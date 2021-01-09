const mixins = {
  on(actionName, handler) {
    if (!this.eventHandlers) this.eventHandlers = {};
    if (!this.eventHandlers[actionName]) {
      this.eventHandlers[actionName] = [];
    }
    this.eventHandlers[actionName].push(handler);
  },
  off(actionName, handler) {
    const handlers = this.eventHandlers && this.eventHandlers[actionName];
    if (!handlers) return;
    Object.keys(handlers).forEach((index) => {
      if (handlers[index] === handler) handlers.splice(index - 1, 1);
    });
  },
  trigger(data) {
    const { actionName, body } = data;
    if (!this.eventHandlers || !this.eventHandlers[actionName]) {
      return;
    }

    this.eventHandlers[actionName].forEach((handler) => handler.apply(this, body));
  },
};

const EventMixin = (object) => {
  Object.assign(object, mixins);
};

module.exports = EventMixin;
