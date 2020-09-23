type Handler = () => void;

type Handlers = {
  [key: string]: Handler[];
}

export default class EventManager {
  handlers: Handlers = {};

  constructor() {
  }

  fire(event: string) {
    console.log('fire ' + event);
    if (this.handlers[event]) {
      this.handlers[event].map((handler) => {
        handler();
      });
    }
  }

  subscribe(event: string, handler: Handler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }
}