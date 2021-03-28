import {
  html, css, property, TemplateResult,
} from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import { ArenaMediatorInterface, ArenaTextInterface } from '../interfaces/Arena';
import { AnyArenaNode, ArenaNodeMediator, ArenaNodeText } from '../interfaces/ArenaNode';
import WebComponent from '../helpers/WebComponent';
import ArenaAttributes from '../interfaces/ArenaAttributes';
import { ArenaFormatings } from '../interfaces/ArenaFormating';
import { Srcset, prepareImageSrc, ImagePluginOptions } from './imagePlugin';

export const getPublic = (srcset: Srcset | undefined) =>
  (node: AnyArenaNode, frms: ArenaFormatings): string => {
    const captionNode = (node as ArenaNodeMediator).getChild(0);
    const src = node.getAttribute('src') as string;
    const alt = node.getAttribute('alt') as string;
    const width = node.getAttribute('width') as number;
    const height = node.getAttribute('height') as number;
    if (!src) {
      return '';
    }
    const img = `<img src="${prepareImageSrc(src, width, height)}" alt="${alt}">`;
    let content = img;
    if (srcset) {
      const sources = srcset.map((item) => `<source media="${item.media}"
      srcset="${item.rations.map((r) => `${prepareImageSrc(src, r.width, r.height)} ${r.ratio}x`).join(', ')}"/>`).join('\n');
      content = `
      <picture>
        ${sources}
        ${img}
      </picture>
      `;
    }

    return `<figure>${content}${captionNode?.getPublicHtml(frms)}</figure>`;
  };

export class ArenaFigure extends WebComponent {
  @property({
    type: String,
  })
  src: string | undefined;

  @property({
    type: Number,
  })
  width: number | undefined;

  @property({
    type: Number,
  })
  height: number | undefined;

  @property({
    type: Boolean,
  })
  withCaption = false;

  loading = false;

  get input(): HTMLInputElement | undefined {
    const input = this.renderRoot.querySelector('#input');
    return input ? input as HTMLInputElement : undefined;
  }

  static styles = css`
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
    `;

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    const image = html`<arena-image
      class="preview-btn"
      src="${ifDefined(this.src)}"
      width="${ifDefined(this.width)}"
      height="${ifDefined(this.height)}"
      @change=${this.handleChange}
    ></arena-image>`;
    // let caption;
    // if (this.withCaption) {
    const caption = html`<div class="caption">
      <div class="caption-placeholder">Подпись:</div>
      <slot name="image-caption"></slot>
    </div>`;
    // }
    return html`
      ${image}
      ${caption}
    `;
  }

  handleChange({ detail }: { detail: ArenaAttributes }): void {
    this.fireChangeAttribute(detail);
  }
}

const defaultOptions: ImagePluginOptions = {
  name: 'image-with-caption',
  icon: `<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Rounded" transform="translate(-851.000000, -2061.000000)">
            <g id="Editor" transform="translate(100.000000, 1960.000000)">
                <g id="-Round-/-Editor-/-nsert_photo" transform="translate(748.000000, 98.000000)">
                    <g>
                        <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                        <path d="M21,19 L21,5 C21,3.9 20.1,3 19,3 L5,3 C3.9,3 3,3.9 3,5 L3,19 C3,20.1 3.9,21 5,21 L19,21 C20.1,21 21,20.1 21,19 Z M8.9,13.98 L11,16.51 L14.1,12.52 C14.3,12.26 14.7,12.26 14.9,12.53 L18.41,17.21 C18.66,17.54 18.42,18.01 18.01,18.01 L6.02,18.01 C5.6,18.01 5.37,17.53 5.63,17.2 L8.12,14 C8.31,13.74 8.69,13.73 8.9,13.98 Z" id="🔹-Icon-Color" fill="currentColor"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`,
  title: 'Image with caption',
  tag: 'ARENA-FIGURE',
  attributes: [],
  allowedAttributes: ['src', 'width', 'height'],
  command: 'add-image-with-caption',
  marks: [
    {
      tag: 'ARENA-FIGURE',
      attributes: [],
    },
    {
      tag: 'FIGURE',
      attributes: [],
    },
  ],
  component: 'arena-figure',
};

const imageWithCaptionPlugin = (opts?: Partial<ImagePluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, allowedAttributes,
      command, marks, component, srcset,
    } = { ...defaultOptions, ...(opts || {}) };
    if (component) {
      if (!customElements.get(component)) {
        customElements.define(component, ArenaFigure);
      }
    }
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const imageCaptionParagraph = textarena.registerArena(
      {
        name: 'image-caption-paragraph',
        tag: 'FIGCAPTION',
        attributes: [
          'slot=image-caption',
        ],
        hasText: true,
        nextArena: paragraph,
      },
      [
        {
          tag: 'FIGCAPTION',
          attributes: [
          ],
        },
      ],
      [],
    ) as ArenaTextInterface;
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        allowedAttributes,
        hasChildren: true,
        protectedChildren: [
          imageCaptionParagraph,
        ],
        arenaForText: imageCaptionParagraph,
        getPublic: getPublic(srcset),
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaMediatorInterface;
    textarena.registerCommand(
      command,
      (ta: Textarena, selection: ArenaSelection) => {
        const sel = ta.insertBeforeSelected(selection, arena);
        return sel;
      },
    );
    textarena.registerCreator({
      name,
      icon,
      title,
      command,
      canShow: (node: ArenaNodeText) =>
        node.parent.isAllowedNode(arena),
    });
  },
});

export default imageWithCaptionPlugin;
