import {
  LitElement,
} from 'lit-element';
import ArenaAttributes from '../interfaces/ArenaAttributes';

export default class WebComponent extends LitElement {
  constructor() {
    super();
    this.addEventListener('keydown', this.handleEvent);
    this.addEventListener('input', this.handleEvent);
    this.addEventListener('mouseup', this.handleEvent);
    this.addEventListener('keyup', this.handleEvent);
    this.addEventListener('keypress', this.handleEvent);
    this.addEventListener('keydown', this.handleEvent);
    this.addEventListener('paste', this.handleEvent);
    this.addEventListener('selectionchange', this.handleEvent);
  }

  disconnectedCallback(): void {
    this.removeEventListener('keydown', this.handleEvent);
    this.removeEventListener('input', this.handleEvent);
    this.removeEventListener('mouseup', this.handleEvent);
    this.removeEventListener('keyup', this.handleEvent);
    this.removeEventListener('keypress', this.handleEvent);
    this.removeEventListener('keydown', this.handleEvent);
    this.removeEventListener('paste', this.handleEvent);
    this.removeEventListener('selectionchange', this.handleEvent);
  }

  protected handleEvent(event: Event): void {
    // Prevent event from ArenaBrowser
    event.stopPropagation();
  }

  protected fireChangeAttribute(attrs: ArenaAttributes): void {
    const event = new CustomEvent('arena-change-attribute', {
      bubbles: true,
      detail: {
        attrs,
        target: this,
      },
    });
    this.dispatchEvent(event);
  }
}
