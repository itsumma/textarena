import {
  LitElement, css, TemplateResult, html,
} from 'lit';

export class ArenaTwoColumns extends LitElement {
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
