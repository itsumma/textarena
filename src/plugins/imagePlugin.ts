import {
  LitElement, html, css, customElement, property, TemplateResult, query,
} from 'lit-element';
import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaWithText from '../interfaces/ArenaWithText';

// This decorator defines the element.
@customElement('arena-image')
export class Callout extends LitElement {
  // This decorator creates a property accessor that triggers rendering and
  // an observed attribute.
  @property({
    reflect: true,
  })
  type = 'great';

  @property({
    reflect: true,
  })
  src: string | undefined;

  static styles = css`
    :host {
      display: block;
      margin: 1rem 0;
    }
    .preview-btn {
      display: block;
      background: #e6e6e6;
      padding-top: 56.25%;
      border: 3px solid #d0d0d0;
    }
    .caption {
      display: flex;
    }
    .caption slot {
      display: block;
      flex: 1;
      margin-left: 1em;
      border-bottom: 1px solid gray;
    }
    input {
      display: none;
    }
    `;

  @query('#input')
  input: undefined | HTMLInputElement;

  // upload() {
  //   if (this.input) {
  //     this.input.click();
  //   }
  // }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    let preview;
    if (this.src) {
      preview = html`<img src="${this.src}"></img>`;
    } else {
      preview = html`<label for="input" class="preview-btn"></label>`;
    }

    return html`<div>
      ${preview}
      <input id=input type="file" />
      <div>
        <label>Подпись: </label>
        <slot name="image-caption"></slot>
      </div>
    </div>`;
  }
}

const defaultOptions = {
  name: 'image',
  icon: '🖼',
  title: 'Image',
  tag: 'ARENA-IMAGE',
  attributes: [],
  shortcut: 'Alt + KeyI',
  hint: 'i',
  command: 'add-image',
};

const imagePlugin = (opts?: typeof defaultOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, shortcut, hint, command,
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
        hasChildren: true,
        protectedChildren: [
          imageCaptionParagraph,
        ],
        arenaForText: imageCaptionParagraph as ArenaWithText,
        allowedArenas: [
          imageCaptionParagraph,
        ],
      },
      [
        {
          tag,
          attributes: [],
        },
      ],
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
    });
  },
});

export default imagePlugin;
