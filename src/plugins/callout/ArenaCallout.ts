import {
  LitElement, html, css, property, TemplateResult,
} from 'lit-element';

export default class ArenaCallout extends LitElement {
  // This decorator creates a property accessor that triggers rendering and
  // an observed attribute.
  @property()
  mood = 'great';

  static styles = css`
    :host {
      display: block;
      padding: 1em;
      overflow: hidden;
      border: 1px solid #ec2ba4;
      border-radius: 1em;
    }
    [name="title"] {
      font-weight: 900;
    }
    [name="title"] * {
      margin: 0;
    }
    .nb {
      color: #ec2ba4;
      user-select: none;
    }`;

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    return html`<div>
      <div class="nb">Внимание!</div>
      <slot name="title"></slot>
      <slot name="body"></slot>
    </div>`;
  }
}
