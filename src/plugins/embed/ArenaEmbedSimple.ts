import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { fetchEmbedData, processEmbedHtml } from './embedUtils';

export default class ArenaEmbedSimple extends LitElement {
  // URL to fetch embed data according to https://oembed.com/
  @property({
    type: String,
  })
    url = '';

  // Name of the OEmbed provider - `provider_name` value
  @property({
    type: String,
  })
    embed = '';

  // Html content encoded as JSON string
  @property({
    type: String,
  })
    html = '';

  htmlPlain = '';

  connectedCallback() {
    super.connectedCallback();
    if (this.html) {
      this.htmlPlain = JSON.parse(this.html);
      return;
    }
    if (this.url) {
      fetchEmbedData(this.url).then((data) => {
        if (data.html) {
          this.htmlPlain = data.html;
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

  createRenderRoot() {
    return this;
  }

  render(): TemplateResult | undefined {
    const body = processEmbedHtml(this.htmlPlain);
    return body as unknown as TemplateResult;
  }
}
