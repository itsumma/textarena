import {
  html, css, property, TemplateResult, CSSResult,
} from 'lit-element';
import WebComponent from '../../helpers/WebComponent';

export default class ArenaFigure extends WebComponent {
  // @property({
  //   type: String,
  // })
  // src: string | undefined;

  // @property({
  //   type: Number,
  // })
  // width: number | undefined;

  // @property({
  //   type: Number,
  // })
  // height: number | undefined;

  @property({
    type: Boolean,
  })
  withCaption = false;

  // @property({
  //   type: Object,
  // })
  // arena: AnyArena | undefined;

  // loading = false;

  // get input(): HTMLInputElement | undefined {
  //   const input = this.renderRoot.querySelector('#input');
  //   return input ? input as HTMLInputElement : undefined;
  // }

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          display: block;
          margin: 0;
          user-select: none;
        }
        .caption {
          display: flex;
          position: relative;
          color: #7c7c7c;
          font-size: 0.8em;
        }
        .caption slot {
          margin-left: 1em;
          /* color: #2c2c2c; */
          flex: 1;
          min-height: 100%;
          display: block;
        }
        .caption-placeholder {
          pointer-events: none;
          font-style: italic;
        }
      `,
    ];
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    // const image = html`<arena-image
    //   class="preview-btn"
    //   src="${ifDefined(this.src)}"
    //   width="${ifDefined(this.width)}"
    //   height="${ifDefined(this.height)}"
    //   @change=${this.handleChange}
    //   .arena=${this.arena}
    // ></arena-image>`;
    // let caption;
    // if (this.withCaption) {
    // const caption = ;
    // }
    return html`
      <slot name="image"></slot>
      <slot name="image-caption"></slot>
    `;
  }

  // handleChange({ detail }: { detail: NodeAttributes }): void {
  //   this.fireChangeAttribute(detail);
  // }
}
