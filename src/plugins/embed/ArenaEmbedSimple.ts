import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import embedServices from './embedServices';
import { fetchEmbedData, processEmbedHtml } from './embedUtils';

export default class ArenaEmbedSimple extends LitElement {
  // URL to fetch embed data according to https://oembed.com/
  @property({
    type: String,
  })
    url = '';

  // Name of the OEmbed provider - `provider_name` value
  // Or value of the src attribute for iframe element if type property is set
  @property({
    type: String,
  })
    embed = '';

  // key of the EmbedServiceMap in ./embedServices.ts
  // If this is set then use iframe with src attribute value from embed
  // property to render embed content
  @property({
    type: String,
  })
    type = '';

  html = 'Loading...';

  connectedCallback() {
    super.connectedCallback();
    if (this.embed && this.type === 'twitter') {
      this.handleTwitterIframe();
    }
    if (this.url) {
      fetchEmbedData(this.url).then((data) => {
        if (data.html) {
          this.html = data.html;
          this.requestUpdate();
          const event = new CustomEvent(
            'change',
            {
              detail: {
                value: data.html,
              },
            },
          );
          this.dispatchEvent(event);
        }
      });
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

  createRenderRoot() {
    return this;
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
    const body = processEmbedHtml(this.html);
    return body as unknown as TemplateResult;
  }
}
