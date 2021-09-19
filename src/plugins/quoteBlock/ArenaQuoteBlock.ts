import {
  LitElement, html, css, property, TemplateResult,
} from 'lit-element';

export default class ArenaQuoteBlock extends LitElement {
  // This decorator creates a property accessor that triggers rendering and
  // an observed attribute.
  @property()
  mood = 'great';

  static styles = css`
    :host {
    }
    .quote-block__line {
      display: flex;
      align-items: center;
      margin: 0.3rem 0.3rem 0.5rem ;
    }
    .quote-block__author-block {
      flex: 1;
      margin-right: 1em;
    }
    /* .quote-block__image {
      width: 2.6em;
      height: 2.6em;
    } */
  `;

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    return html`
      <div class="quote-block__line">
        <div class="quote-block__author-block">
          <slot name="quote_author"></slot>
          <slot name="quote_role"></slot>
        </div>
        <div class="quote-block__image">
          <slot></slot>
        </div>
      </div>
      <div class="quote-block__body">
        <slot name="quote_body"></slot>
      </div>
    `;
  }
}
