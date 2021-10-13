import {
  LitElement, html, css, TemplateResult,
} from 'lit-element';

export default class ArenaTable extends LitElement {
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
