import {
  LitElement, html, css, TemplateResult,
} from 'lit-element';

export default class ArenaTwoColumns extends LitElement {
  static styles = css`
    :host {
      display: flex;
      min-height: 2em;
    }
  `;

  render(): TemplateResult {
    return html`
      <slot></slot>
      <slot></slot>
    `;
  }
}
