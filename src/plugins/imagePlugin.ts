import {
  LitElement, html, css, customElement, property, TemplateResult, query,
} from 'lit-element';
import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';
import ArenaSelection from 'ArenaSelection';
import ArenaAncestor from 'interfaces/ArenaAncestor';
import ArenaWithText from 'interfaces/ArenaWithText';

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
      <slot name="image-title"></slot>
      <slot name="alt"></slot>
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

const imagePlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: typeof defaultOptions): void {
    const {
      name, icon, title, tag, attributes, shortcut, hint, command,
    } = { ...defaultOptions, ...(opts || {}) };
    const paragraph = textarena.model.getArena('paragraph');
    if (!paragraph) {
      throw new Error('Paragraph not found');
    }
    const allowedArenas = [
      paragraph,
    ];
    const calloutTitleParagraph = textarena.model.registerArena(
      {
        name: 'image-title-paragraph',
        tag: 'P',
        attributes: [
          'slot=image-title',
        ],
        allowText: true,
        allowFormating: true,
      },
      [
        {
          tag: 'P',
          attributes: [
            'slot=image-title',
          ],
        },
      ],
      [ArenaModel.rootArenaName],
    );
    const arena = textarena.model.registerArena(
      {
        name,
        tag,
        attributes,
        hasChildren: true,
        protectedChildren: [
          calloutTitleParagraph,
        ],
        arenaForText: calloutTitleParagraph as ArenaWithText,
        allowedArenas: [
          calloutTitleParagraph,
        ],
      },
      [
        {
          tag,
          attributes: [],
        },
      ],
      [ArenaModel.rootArenaName],
    );
    textarena.commandManager.registerCommand(
      command,
      (ta: Textarena, selection: ArenaSelection) => {
        const sel = ta.model.transformModel(selection, arena);
        return sel;
      },
    );

    textarena.commandManager.registerShortcut(
      shortcut,
      command,
    );
    textarena.creatorBar.registerCreator({
      name,
      icon,
      title,
      shortcut,
      hint,
      command,
    });
  },
};

export default imagePlugin;
