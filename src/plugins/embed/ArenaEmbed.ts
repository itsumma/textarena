import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import NodeAttributes from '../../interfaces/NodeAttributes';
import WebComponent from '../../helpers/WebComponent';

export default class ArenaEmbed extends WebComponent {
  @property({
    type: String,
  })
    type: string | undefined;

  @property({
    type: String,
  })
    embed: string | undefined;

  @property({
    type: Boolean,
  })
    border: boolean | undefined;

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

  handleToggle({ detail }: { detail: boolean }): void {
    this.fireChangeAttribute({
      border: detail,
    });
  }

  handleForm({ detail }: { detail: NodeAttributes }): void {
    this.fireChangeAttribute(detail);
  }

  render(): TemplateResult {
    if (this.type && this.embed) {
      return html`
        <arena-embed-simple
          type="${this.type}"
          embed="${this.embed}"
          ew="${this.ew}"
          eh="${this.eh}"
        ></arena-embed-simple>`;
    }
    return html`<arena-embed-form @change="${this.handleForm}"></arena-embed-form>`;
  }
}
