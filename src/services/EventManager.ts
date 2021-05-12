import ArenaServiceManager from './ArenaServiceManager';
import ArenaEvent from '../helpers/ArenaEvent';

export type MediaEvent = {
  name: string,
  target?: HTMLElement,
  data?: unknown,
};

export type ArenaHandler = (event: ArenaEvent) => void;

type Handlers = {
  [key: string]: ArenaHandler[];
};

export default class EventManager {
  handlers: Handlers = {};

  constructor(private asm: ArenaServiceManager) {
  }

  fire(name: string, detail?: unknown): void {
    const event = new ArenaEvent(name, detail);
    this.asm.logger.log('fire', event);
    if (this.handlers[name]) {
      this.handlers[name].map((handler) => handler(event));
    }
    if (this.handlers['*']) {
      this.handlers['*'].map((handler) => handler(event));
    }
  }

  subscribe(event: string, handler: ArenaHandler): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }
}
