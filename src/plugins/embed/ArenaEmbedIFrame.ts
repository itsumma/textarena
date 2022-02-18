import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { embedServices } from './embedServices';

export class ArenaEmbedIFrame extends LitElement {
  // The src attribute for iframe element if type property is set
  @property({
    type: String,
  })
    embed = '';

  // key of the EmbedServiceMap in ./embedServices.ts
  @property({
    type: String,
  })
    type = '';

  connectedCallback() {
    super.connectedCallback();
    if (this.embed && this.type === 'twitter') {
      this.handleTwitterIframe();
    }
  }

  handleTwitterIframe() {
    // Using hack from https://twitframe.com/#sizing
    setTimeout(() => {
      const frame = this.renderRoot.querySelector(`#${this.iframeId}`) as HTMLIFrameElement;
      frame?.addEventListener('load', () => {
        if (frame.contentWindow) {
          frame.contentWindow.postMessage(
            {
              element: frame.id,
              query: 'height',
            },
            'https://twitframe.com',
          );
        }
      });
      window.addEventListener('message', ({ origin, data: { element, height } }) => {
        if (origin === 'https://twitframe.com' && element === this.iframeId && height) {
          frame.height = height;
        }
      });
    });
  }

  get iframeId() {
    return `iframe-${this.type}-${this.embed?.split('/').pop()?.split('?').pop()}`;
  }

  render(): TemplateResult | undefined {
    if (this.embed && this.type) {
      const service = embedServices[this.type];
      if (service) {
        const { html: htmlTemplate } = service;
        return html`
          <div embed class="embed embed-${this.type}" type="${this.type}">
            ${unsafeHTML(htmlTemplate.replace(/^<([^>]+?)>/, `<$1 id="${this.iframeId}" src="${this.embed}">`))}
          </div>
        `;
      }
    }
    return undefined;
  }
}
