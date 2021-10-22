import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import NodeAttributes from '../../interfaces/NodeAttributes';

export default class ArenaEmbed extends LitElement {
  @property({
    type: String,
  })
    type: string | undefined;

  @property({
    type: String,
  })
    href: string | undefined;

  @property({
    type: String,
  })
    postid: string | undefined;

  @property({
    type: Boolean,
  })
    border: boolean | undefined;

  createRenderRoot(): LitElement {
    return this;
  }

  handleToggle({ detail }: { detail: boolean }): void {
    this.fireChangeAttribute({
      border: detail,
    });
  }

  handleForm({ detail }: { detail: NodeAttributes }): void {
    this.fireChangeAttribute(detail);
  }

  fireChangeAttribute(attrs: NodeAttributes): void {
    const event = new CustomEvent('arena-change-attribute', {
      bubbles: true,
      detail: {
        attrs,
        target: this,
      },
    });
    this.dispatchEvent(event);
  }

  render(): TemplateResult {
    if (this.type === 'youtube' && this.href) {
      return html`
        <arena-embed-youtube
          ?border=${this.border}
          @toggle=${this.handleToggle}
          href="${this.href}"
        ></arena-embed-youtube>`;
    }
    if (this.type && this.href) {
      return html`
        <arena-embed-simple
          type="${this.type}"
          href="${this.href}"
          postid="${this.postid || ''}"
        ></arena-embed-simple>`;
    }
    return html`<arena-embed-form @change="${this.handleForm}"></arena-embed-form>`;
  }
}
