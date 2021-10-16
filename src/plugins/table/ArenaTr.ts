import {
  LitElement, css, TemplateResult, html,
} from 'lit';

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
