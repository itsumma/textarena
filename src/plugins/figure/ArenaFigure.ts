import {
  html, css, property, TemplateResult, CSSResult,
} from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { styleMap } from 'lit-html/directives/style-map.js';
import WebComponent from '../../helpers/WebComponent';
import { AnyArena } from '../../interfaces/Arena';
import { ArenaNodeInline } from '../../interfaces/ArenaNode';
import { FigureClass } from './types';

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

  @property({
    type: Object,
  })
  arena: AnyArena | undefined;

  @property({ type: Object })
  node: ArenaNodeInline | undefined;

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
          position: relative;
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
        .panel {
          position: absolute;
          top: 2em;
          left: 0;
          right: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          pointer-events: none;
          display: none;
        }
        :host(:hover) .panel {
          display: flex;
        }
        .panel-content {
          pointer-events: initial;
          background: #0000007a;
          padding: 0.2em 0.1em;
          border-radius: 0.1em;
          display: flex;
        }
        .btn {
          border: none;
          background: none;
          color: #a0a0a0;
          width: 1.8em;
          height: 1.8em;
          padding: 0.1em;
          margin: 0 0.1em;
        }
        .btn.active {
          color: white;
        }
        .btn:hover {
          color: white;
        }
        .image-wrap {
          position: relative;
        }
      `,
    ];
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    const figireClass = this.getActiveClass();
    let wrapStyles = {};
    let imageStyles = {};
    if (figireClass?.ratio) {
      wrapStyles = {
        paddingTop: `${100 / figireClass.ratio}%`,
        overflow: 'hidden',
        position: 'relative',
      };
      imageStyles = {
        position: 'absolute',
        inset: '0px',
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'center',
      };
    }
    return html`
      ${this.getPanel()}
      <div class="picture-wrap" style=${styleMap(wrapStyles)}>
        <div class="image-wrap" style=${styleMap(imageStyles)}>
          <slot name="image"></slot>
        </div>
      </div>
      <slot name="image-caption"></slot>
    `;
  }

  changeClass(figureClass: FigureClass) {
    return (): void => {
      if (this.node) {
        this.fireChangeAttribute({
          class: figureClass.className,
          // ratio: figureClass.ratio,
        }, false);
      }
    };
  }

  getPanel(): TemplateResult | null {
    if (!this.node) {
      return null;
    }
    const classes = this.node.arena.getAttribute('classes') as FigureClass[];
    if (!classes) {
      return null;
    }
    const className = this.node.getAttribute('class');
    return html`
    <div class="panel">
      <div class="panel-content">
        ${classes.map((figureClass) => html`
          <button @click="${this.changeClass(figureClass)}" class="btn ${className === figureClass.className ? 'active' : ''}">
            ${unsafeHTML(figureClass.icon)}
          </button>
        `)}
      </div>
    </div>`;
  }

  getActiveClass(): FigureClass | undefined {
    if (!this.node) {
      return undefined;
    }
    const classes = this.node.arena.getAttribute('classes') as FigureClass[];
    if (!classes) {
      return undefined;
    }
    const className = this.node.getAttribute('class');
    if (!className) {
      return undefined;
    }
    return classes.find((figureClass) => figureClass.className === className);
  }
}
