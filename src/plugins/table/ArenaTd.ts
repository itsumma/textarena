import {
  LitElement, css, TemplateResult, html,
} from 'lit';

export class ArenaTd extends LitElement {
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
