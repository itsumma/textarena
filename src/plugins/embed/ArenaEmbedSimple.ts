import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import embedServices from './embedServices';

export default class ArenaEmbedSimple extends LitElement {
  @property({
    type: String,
  })
    type: string | undefined;

  @property({
    type: String,
  })
    embed: string | undefined;

  @property({
    type: Number,
  })
    ew: number | undefined;

  @property({
    type: Number,
  })
    eh: number | undefined;

  createRenderRoot(): LitElement {
    return this;
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult | undefined {
    if (this.embed && this.type) {
      const service = embedServices[this.type];
      if (service) {
        const { html: htmlTemplate } = service;
        return html`
          <div embed class="embed embed-${this.type}" type="${this.type}">
            ${unsafeHTML(htmlTemplate.replace(/^<([^>]+?)>/, `<$1 src="${this.embed}">`))}
          </div>`;
      }
    }
    return undefined;
  }
}
