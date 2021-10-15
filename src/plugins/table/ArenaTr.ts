import {
  LitElement, html, css, TemplateResult,
} from 'lit-element';

export default class ArenaTr extends LitElement {
  static styles = css`
    :host {
      display: table-row;
    }
  `;

  render(): TemplateResult {
    return html`
      <slot></slot>
    `;
  }
}
