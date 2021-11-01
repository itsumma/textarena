import {
  css,
  CSSResult,
  html, LitElement, TemplateResult,
} from 'lit';
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

  static get styles(): CSSResult[] {
    return [
      css`
        .embed-youtube {
          width: 100%;
          padding-bottom: 56.25%;
          position: relative;
          margin: 0 0 1em;
          background: #ccc;
          overflow: hidden;
        }
        
        .embed-youtube-iframe {
          width: 100%;
          height: 100%;
          margin: 0;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          border: none;
          min-width: 100%;
          width: 0;
          max-width: 100%;
          min-height: 100%;
          height: 0;
          max-height: 100%;
        }
      `,
    ];
  }

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
            { element: frame.id, query: 'height' },
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

  // Render element DOM by returning a `lit-html` template.
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
