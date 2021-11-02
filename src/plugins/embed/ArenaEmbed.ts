import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import WebComponent from '../../helpers/WebComponent';
import { getEmbedUrl } from './embedUtils';
import { GetEmbedProvider } from './types';

export default class ArenaEmbed extends WebComponent {
  @property({
    type: String,
  })
    url: string | undefined;

  @property({
    type: String,
  })
    embed: string | undefined;

  @property({
    type: String,
  })
    html: string | undefined;

  createRenderRoot(): LitElement {
    return this;
  }

  handleForm({ detail: { value } }: { detail: { value: string } }): void {
    const getEmbedProvider = this.node?.getAttribute('getEmbedProvider') as GetEmbedProvider;
    const result = getEmbedProvider(value);
    if (result) {
      this.fireChangeAttribute({
        embed: result.provider_name,
        url: getEmbedUrl(result.endpoint, value, result.opts),
      });
    }
  }

  onKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.fireRemoveEvent();
        break;
      default:
        break;
    }
  }

  handleHtml({ detail: { value } }: { detail: { value: string } }): void {
    if (value) {
      this.fireChangeAttribute({
        html: JSON.stringify(value),
      });
    }
  }

  render(): TemplateResult {
    if (this.url && this.embed) {
      return html`
        <arena-embed-simple
          url="${this.url}"
          embed="${this.embed}"
          @change="${this.handleHtml}"
        ></arena-embed-simple>`;
    }
    return html`
        <arena-embed-form
          @change="${this.handleForm}"
          @keydown="${this.onKeydown}">
        </arena-embed-form>`;
  }
}
