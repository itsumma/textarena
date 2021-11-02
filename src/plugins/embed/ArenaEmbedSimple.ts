import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { fetchEmbedData, processEmbedHtml } from './embedUtils';

export default class ArenaEmbedSimple extends LitElement {
  @property({
    type: String,
  })
    url = '';

  @property({
    type: String,
  })
    embed = '';

  html = 'Loading...';

  connectedCallback() {
    super.connectedCallback();
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

  createRenderRoot() {
    return this;
  }

  render(): TemplateResult | undefined {
    const body = processEmbedHtml(this.html);
    return body as unknown as TemplateResult;
  }
}
