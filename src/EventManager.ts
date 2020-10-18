type Handler = (event?: string | MediaEvent) => void;

type Handlers = {
  [key: string]: Handler[];
}

export type MediaEvent = {
  name: string,
  target?: HTMLElement,
}

export default class EventManager {
  handlers: Handlers = {};

  constructor() {
  }

  fire(event: string | MediaEvent) {
    const eventName = typeof event === 'string' ? event : event.name;
    if (this.handlers[eventName]) {
      this.handlers[eventName].map((handler) => {
        handler(event);
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
