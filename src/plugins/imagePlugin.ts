import {
  html, css, property, TemplateResult,
} from 'lit-element';
import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import { ArenaMediatorInterface } from '../interfaces/Arena';
import { ArenaNodeText } from '../interfaces/ArenaNode';
import WebComponent from '../helpers/WebComponent';

// This decorator defines the element.

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

  static styles = css`
    :host {
      display: block;
      /* margin: 1rem 0; */
      user-select: none;
    }
    .preview-btn {
      display: block;
      background: #e6e6e6;
      padding-top: 56.25%;
      border: 3px solid #d0d0d0;
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
    input {
      display: none;
    }
    img {
      display: block;
      width: 100%;
    }
    `;

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    let preview;
    if (this.loading) {
      preview = html`<div class="preview-btn">Грузится…</div>`;
    } else if (this.src) {
      preview = html`<img src="${this.prepareSrc(this.src)}" />`;
    } else {
      preview = html`<label for="input" class="preview-btn"></label>`;
    }
    let caption;
    // if (this.caption) {
    //   caption = html`<div class="caption">
    //   <div class="caption-placeholder">Подпись:</div>
    //   <slot name="image-caption"></slot>
    // </div>`;
    // }
    return html`<div>
      ${preview}
      <input id=input type="file" @change=${this.onChange}/>
      ${caption}
    </div>`;
  }

  private prepareSrc(src: string): string {
    if (!this.width || !this.height) {
      return src;
    }
    const arr = src.split('.');
    if (arr.length < 2) {
      return src;
    }
    arr[arr.length - 2] += `_${this.width}_${this.height}`;
    return arr.join('.');
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
            this.fireChangeAttribute({ src });
          }
          this.requestUpdate();
        }).catch(() => {
          this.loading = false;
          this.requestUpdate();
        });
      }
      this.loading = false;
      this.requestUpdate();
    }).catch(() => {
      this.loading = false;
      this.requestUpdate();
    });
  }
}

const defaultOptions = {
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

const imagePlugin = (opts?: typeof defaultOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, allowedAttributes,
      shortcut, hint, command, marks, component,
    } = { ...defaultOptions, ...(opts || {}) };
    if (!customElements.get(component)) {
      customElements.define(component, Image);
    }
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    // const imageCaptionParagraph = textarena.registerArena(
    //   {
    //     name: 'image-caption-paragraph',
    //     tag: 'P',
    //     attributes: [
    //       'slot=image-caption',
    //     ],
    //     hasText: true,
    //     nextArena: paragraph,
    //   },
    //   [
    //     {
    //       tag: 'P',
    //       attributes: [
    //         'slot=image-caption',
    //       ],
    //     },
    //   ],
    //   [],
    // ) as ArenaTextInterface;
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        allowedAttributes,
        single: true,
        // hasChildren: true,
        // protectedChildren: [
        //   imageCaptionParagraph,
        // ],
        // arenaForText: imageCaptionParagraph,
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

    textarena.registerShortcut(
      shortcut,
      command,
    );
    textarena.registerCreator({
      name,
      icon,
      title,
      shortcut,
      hint,
      command,
      canShow: (node: ArenaNodeText) =>
        node.parent.arena.allowedArenas.includes(arena),
    });
  },
});

export default imagePlugin;
