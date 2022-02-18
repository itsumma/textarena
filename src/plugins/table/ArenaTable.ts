import {
  css, html, LitElement, TemplateResult,
} from 'lit';

export class ArenaTable extends LitElement {
  static styles = css`
    :host {
      display: table;
      min-height: 2em;
    }
  `;

  render(): TemplateResult {
    return html`
      <slot></slot>
    `;
  }
}
