import {
  LitElement, html, css, TemplateResult,
} from 'lit-element';

export default class ArenaTd extends LitElement {
  static styles = css`
    :host {
      display: table-cell;
    }
  `;

  render(): TemplateResult {
    return html`
      <slot></slot>
    `;
  }
}
