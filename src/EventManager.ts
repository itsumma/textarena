import Textarena from 'Textarena';

export type MediaEvent = {
  name: string,
  target?: HTMLElement,
  data?: any,
};

type Handler = (event?: string | MediaEvent) => void;

type Handlers = {
  [key: string]: Handler[];
};

export default class EventManager {
  handlers: Handlers = {};

  constructor(private textarena: Textarena) {
  }

  fire(event: string | MediaEvent): void {
    this.textarena.logger.log(`fire:  ${event}`);
    const eventName = typeof event === 'string' ? event : event.name;
    if (this.handlers[eventName]) {
      this.handlers[eventName].map((handler) => handler(event));
    }
  }

  subscribe(event: string, handler: Handler): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }
}
