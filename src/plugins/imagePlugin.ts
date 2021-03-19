import {
  LitElement, html, css, customElement, property, TemplateResult,
} from 'lit-element';
import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaWithText from '../interfaces/ArenaWithText';
import ArenaNodeText from '../interfaces/ArenaNodeText';

// This decorator defines the element.
@customElement('arena-image')
export class Callout extends LitElement {
  // This decorator creates a property accessor that triggers rendering and
  // an observed attribute.
  @property({
    reflect: true,
  })
  type = 'great';

  protected currentSrc = '';

  @property({
    type: String,
  })
  set src(value: string) {
    this.currentSrc = value;
  }

  get src(): string {
    return this.currentSrc;
  }

  loading = false;

  get input(): HTMLInputElement | undefined {
    const input = this.renderRoot.querySelector('#input');
    return input ? input as HTMLInputElement : undefined;
  }

  static styles = css`
    :host {
      display: block;
      margin: 1rem 0;
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
      preview = html`<img src="${this.src}" />`;
    } else {
      preview = html`<label for="input" class="preview-btn"></label>`;
    }
    return html`<div>
      ${preview}
      <input id=input type="file" @change=${this.onChange}/>
      <div class="caption">
        <div class="caption-placeholder">Подпись:</div>
        <slot name="image-caption"></slot>
      </div>
    </div>`;
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
    data.append('user', 'hubot');
    fetch('https://izo.itsumma.ru', {
      method: 'POST',
      body: data,
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY2xpZW50IiwidG9rZW5JZCI6ImQyNzRhOTAzLTAyYWMtNGE2MS1hNmNiLTdiOTlkZGQ0YmIyNiIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTYxNDIzMzY4NywiZXhwIjoxNjQ1NzY5Njg3fQ.fEzuI8L9P7z9tcZ7PiocLQrf_gW9CF_JxrpQLxYHDRk',
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((url) => {
          if (url) {
            this.fireChangeAttribute('src', url);
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

  private fireChangeAttribute(name: string, value: string): void {
    const event = new CustomEvent('arena-change-attribute', {
      bubbles: true,
      detail: {
        name,
        value,
        target: this,
      },
    });
    this.dispatchEvent(event);
  }
}

const defaultOptions = {
  name: 'image',
  icon: '🖼',
  title: 'Image',
  tag: 'ARENA-IMAGE',
  attributes: [],
  allowedAttributes: ['src'],
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
};

const imagePlugin = (opts?: typeof defaultOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, allowedAttributes, shortcut, hint, command, marks,
    } = { ...defaultOptions, ...(opts || {}) };
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const imageCaptionParagraph = textarena.registerArena(
      {
        name: 'image-caption-paragraph',
        tag: 'P',
        attributes: [
          'slot=image-caption',
        ],
        allowText: true,
        allowFormating: true,
        nextArena: paragraph,
      },
      [
        {
          tag: 'P',
          attributes: [
            'slot=image-caption',
          ],
        },
      ],
      [],
    );
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
        arenaForText: imageCaptionParagraph as ArenaWithText,
        allowedArenas: [
          imageCaptionParagraph,
        ],
      },
      marks,
      [textarena.getRootArenaName()],
    );
    textarena.registerCommand(
      command,
      (ta: Textarena, selection: ArenaSelection) => {
        const sel = ta.transformModel(selection, arena);
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
      canShow: (node: ArenaNodeText) => node.parent.arena.allowedArenas.includes(arena),
    });
  },
});

export default imagePlugin;
