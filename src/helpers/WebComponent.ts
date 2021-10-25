import { LitElement } from 'lit';
import {
  property,
} from 'lit/decorators.js';
import { AnyArenaNode } from '../interfaces/ArenaNode';
import NodeAttributes from '../interfaces/NodeAttributes';

export default class WebComponent extends LitElement {
  @property({ type: Object })
    node: AnyArenaNode | undefined;

  constructor() {
    super();
    this.addEventListener('keydown', this.handleEvent);
    this.addEventListener('input', this.handleEvent);
    this.addEventListener('mouseup', this.handleEvent);
    this.addEventListener('keyup', this.handleEvent);
    this.addEventListener('keypress', this.handleEvent);
    this.addEventListener('keydown', this.handleEvent);
    this.addEventListener('paste', this.handleEvent);
    this.addEventListener('copy', this.handleEvent);
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
    this.removeEventListener('copy', this.handleEvent);
    this.removeEventListener('selectionchange', this.handleEvent);
  }

  protected handleEvent(event: Event): void {
    const path = event.composedPath();
    let elem: Node | null = path && path.length ? path[0] as unknown as Node : null;
    while (elem) {
      if (elem === this.shadowRoot) {
        // Prevent event from ArenaBrowser
        event.stopPropagation();
        return;
      }
      elem = elem.parentNode;
    }
  }

  protected fireChangeAttribute(attrs: NodeAttributes, stopRender = false): void {
    const event = new CustomEvent('arena-change-attribute', {
      bubbles: true,
      detail: {
        attrs,
        target: this,
        stopRender,
        node: this.node,
      },
    });
    this.dispatchEvent(event);
  }

  protected fireCustomEvent(e: unknown): void {
    const event = new CustomEvent('arena-custom-event', {
      bubbles: true,
      detail: e,
    });
    this.dispatchEvent(event);
  }
}
