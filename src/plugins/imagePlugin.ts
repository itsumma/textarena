import {
  html, css, property, TemplateResult, CSSResult,
} from 'lit-element';
import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaPlugin, { DefaulPlugintOptions } from '../interfaces/ArenaPlugin';
import { ArenaSingleInterface } from '../interfaces/Arena';
import { AnyArenaNode, ArenaNodeText } from '../interfaces/ArenaNode';
import WebComponent from '../helpers/WebComponent';

type ImgSize = {
  width: number;
  height: number;
};

export type Srcset = Array<{
  media: string;
  rations: Array<ImgSize & { ratio: number }>
}>;

export type ImagePluginOptions = DefaulPlugintOptions & {
  srcset?: Srcset,
};

export const prepareImageSrc = (src: string, width?: number, height?: number): string => {
  if (!width || !height) {
    return src;
  }
  const arr = src.split('.');
  if (arr.length < 2) {
    return src;
  }
  arr[arr.length - 2] += `_${width}_${height}`;
  return arr.join('.');
};

// TODO webp
const getPublic = (srcset: Srcset | undefined) =>
  (node: AnyArenaNode): string => {
    const src = node.getAttribute('src') as string;
    const alt = node.getAttribute('alt') as string;
    const width = node.getAttribute('width') as number;
    const height = node.getAttribute('height') as number;
    const slot = node.getAttribute('slot') as string;
    const className = node.getAttribute('class') as string;
    if (!src) {
      return '';
    }
    const img = `<img src="${prepareImageSrc(src, width, height)}" alt="${alt}" slot="${slot}" class="${className}">`;
    if (srcset) {
      const sources = srcset.map((item) => `<source media="${item.media}"
      srcset="${item.rations.map((r) => `${prepareImageSrc(src, r.width, r.height)} ${r.ratio}x`).join(', ')}"/>`).join('\n');
      return `
      <picture>
        ${sources}
        ${img}
      </picture>`;
    }
    return img;
  };

export class Image extends WebComponent {
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

  loading = false;

  get input(): HTMLInputElement | undefined {
    const input = this.renderRoot.querySelector('#input');
    return input ? input as HTMLInputElement : undefined;
  }

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          display: block;
          margin: 0;
          user-select: none;
        }
        .empty {
          display: flex;
          box-sizing: border-box;
          justify-content: center;
          align-items: center;
          background: #e6e6e6;
          /* padding-top: 56.25%; */
          padding: .2rem;
          border: 3px solid #d0d0d0;
          color: #ccc;
          height: 100%;
          width: 100%;
        }
        .input {
          display: none;
        }
        .img {
          display: block;
          max-width: 100%;
          margin: auto;
        }
        .svg {
          width: 3rem;
          max-width: 80%;
          max-height: 80%;
          height: auto;
        }
        label {
          cursor: pointer;
        }
      `,
    ];
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    let preview;
    if (this.loading) {
      preview = html`<div class="empty">Грузится…</div>`;
    } else if (this.src) {
      preview = html`<label for="input">
        <img class="img" src="${prepareImageSrc(this.src, this.width, this.height)}" />
      </label>`;
    } else {
      preview = html`<label for="input" class="empty">
        <svg class="svg" viewBox="0 -18 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m432 0h-352c-44.113281 0-80 35.886719-80 80v280c0 44.113281 35.886719 80 80 80h273c11.046875 0 20-8.953125 20-20s-8.953125-20-20-20h-73.664062l-45.984376-59.65625 145.722657-185.347656 98.097656 108.421875c5.546875 6.136719 14.300781 8.21875 22.019531 5.246093 7.714844-2.976562 12.808594-10.394531 12.808594-18.664062v-170c0-44.113281-35.886719-80-80-80zm40 198.085938-79.167969-87.503907c-3.953125-4.371093-9.640625-6.785156-15.523437-6.570312-5.886719.207031-11.386719 2.996093-15.03125 7.628906l-154.117188 196.023437-52.320312-67.875c-3.785156-4.910156-9.636719-7.789062-15.839844-7.789062-.003906 0-.007812 0-.011719 0-6.203125.003906-12.058593 2.886719-15.839843 7.804688l-44.015626 57.21875c-6.734374 8.757812-5.097656 21.3125 3.65625 28.046874 8.757813 6.738282 21.3125 5.097657 28.050782-3.65625l28.175781-36.632812 88.816406 115.21875h-148.832031c-22.054688 0-40-17.945312-40-40v-280c0-22.054688 17.945312-40 40-40h352c22.054688 0 40 17.945312 40 40zm0 0" fill="currentColor"/><path d="m140 72c-33.085938 0-60 26.914062-60 60s26.914062 60 60 60 60-26.914062 60-60-26.914062-60-60-60zm0 80c-11.027344 0-20-8.972656-20-20s8.972656-20 20-20 20 8.972656 20 20-8.972656 20-20 20zm0 0" fill="currentColor"/><path d="m468.476562 302.941406c-.058593-.058594-.117187-.121094-.175781-.179687-9.453125-9.519531-22.027343-14.761719-35.410156-14.761719-13.34375 0-25.882813 5.210938-35.324219 14.675781l-38.613281 38.085938c-7.863281 7.753906-7.949219 20.417969-.191406 28.28125 7.753906 7.863281 20.417969 7.953125 28.28125.195312l25.847656-25.492187v112.253906c0 11.046875 8.953125 20 20 20s20-8.953125 20-20v-111.644531l24.738281 25.554687c3.921875 4.054688 9.144532 6.089844 14.371094 6.089844 5.011719 0 10.027344-1.871094 13.910156-5.628906 7.9375-7.683594 8.140625-20.34375.457032-28.28125zm0 0" fill="currentColor"/></svg>
      </label>`;
    }
    return html`
      ${preview}
      <input class="input" id=input type="file" @change=${this.onChange}/>
    `;
  }

  private onChange() {
    if (this.input?.files && this.input?.files?.length > 0) {
      this.upload(this.input.files[0]);
    }
  }

  private upload(file: File) {
    this.loading = true;
    this.requestUpdate();
    const data = new FormData();
    data.append('file', file);
    fetch('https://izo.itsumma.ru', {
      method: 'POST',
      body: data,
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY2xpZW50IiwidG9rZW5JZCI6ImQyNzRhOTAzLTAyYWMtNGE2MS1hNmNiLTdiOTlkZGQ0YmIyNiIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTYxNDIzMzY4NywiZXhwIjoxNjQ1NzY5Njg3fQ.fEzuI8L9P7z9tcZ7PiocLQrf_gW9CF_JxrpQLxYHDRk',
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((src) => {
          if (src) {
            setTimeout(() => {
              const event = new CustomEvent('change', {
                detail: { src },
              });
              this.loading = false;
              this.dispatchEvent(event);
              this.fireChangeAttribute({ src });
              this.requestUpdate();
            }, 2000);
          }
        }).catch(() => {
          this.loading = false;
          this.requestUpdate();
        });
      }
    }).catch(() => {
      this.loading = false;
      this.requestUpdate();
    });
  }
}

const defaultOptions: ImagePluginOptions = {
  name: 'image',
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
  title: 'Image',
  tag: 'ARENA-IMAGE',
  attributes: [],
  allowedAttributes: ['src', 'width', 'height'],
  shortcut: 'Alt + KeyI',
  hint: 'i',
  command: 'add-image',
  marks: [
    {
      tag: 'ARENA-IMAGE',
      attributes: [],
    },
    {
      tag: 'IMG',
      attributes: [],
    },
  ],
  component: 'arena-image',
};

const imagePlugin = (opts?: ImagePluginOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, allowedAttributes,
      shortcut, hint, command, marks, component, srcset,
    } = { ...defaultOptions, ...(opts || {}) };
    if (component) {
      if (!customElements.get(component)) {
        customElements.define(component, Image);
      }
    }
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        allowedAttributes,
        single: true,
        getPublic: getPublic(srcset),
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaSingleInterface;
    textarena.registerCommand(
      command,
      (ta: Textarena, selection: ArenaSelection) => {
        const sel = ta.insertBeforeSelected(selection, arena);
        return sel;
      },
    );
    if (shortcut) {
      textarena.registerShortcut(
        shortcut,
        command,
      );
    }
    textarena.registerCreator({
      name,
      icon,
      title,
      shortcut,
      hint,
      command,
      canShow: (node: ArenaNodeText) =>
        node.parent.isAllowedNode(arena),
    });
  },
});

export default imagePlugin;
