import {
  LitElement, html, css, property, TemplateResult,
} from 'lit-element';
import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaWithText from '../interfaces/ArenaWithText';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaAncestor from '../interfaces/ArenaAncestor';

// This decorator defines the element.
export class Collapse extends LitElement {
  // This decorator creates a property accessor that triggers rendering and
  // an observed attribute.
  @property()
  mood = 'great';

  static styles = css`
    :host {
      background: lightgray;
      border: 1px solid red;
      display: block;
      padding: 1em;
    }
    [name="title"] {
      font-weight: 900;

    }
    [name="title"] * {
      margin: 0;
    }
    .hr {
      white-space: nowrap;
      overflow: hidden;
      font-size: .4em;
      user-select: none;
    }
    .nb {
      color: red;
      user-select: none;
    }
    span {
      color: green;
    }`;

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    return html`
      <div class="stk-snippet stk-snippet-wrapper stk-container incut no-ad vrez-margins" data-ce-tag="container" data-container-name="Incut">
        <div class="stk-container my-outer-block incut_header" data-ce-tag="container">
          <slot name="title" class="stk-reset wp-exclude-emoji stk-theme_37074__style_medium_header incut_title">Заголовок</slot>
          <div class="stk-container my-outer-block incut_svg" data-ce-tag="container">
            <svg class="incut_arrow" width="18" height="9" viewbox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 1.5L9 7.5L1 1.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
        </div>
        <slot name='body' class="stk-reset wp-exclude-emoji stk-theme_37074__mb_cus_10 incut_text">Контент</slot>
      </div>
    `;
  }
}

const defaultOptions = {
  name: 'collapse',
  icon: '<b>🌂</b>',
  title: 'Collapse',
  tag: 'ARENA-COLLAPSE',
  attributes: [],
  shortcut: 'Alt + KeyC',
  hint: 'c',
  command: 'add-collapse',
};

const collapsePlugin = (opts?: typeof defaultOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    customElements.define('arena-collapse', Collapse);
    const {
      name, icon, title, tag, attributes, shortcut, hint, command,
    } = { ...defaultOptions, ...(opts || {}) };
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const allowedArenas = textarena.getSimpleArenas();
    const collapseBodyContainer = textarena.registerArena(
      {
        name: 'collapse-body-container',
        tag: 'COLLAPSE-BODY',
        attributes: [
          'slot=body',
        ],
        hasChildren: true,
        allowedArenas,
        arenaForText: paragraph as ArenaWithText,
      },
      [
        {
          tag: 'COLLAPSE-BODY',
          attributes: [
            'slot=body',
          ],
        },
      ],
      [],
    );
    const collapseTitleParagraph = textarena.registerArena(
      {
        name: 'collapse-title-paragraph',
        tag: 'H3',
        attributes: [
          'slot=title',
        ],
        allowText: true,
        allowFormating: true,
        nextArena: collapseBodyContainer as ArenaAncestor,
      },
      [
        {
          tag: 'H3',
          attributes: [
            'slot=title',
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
          collapseTitleParagraph,
          collapseBodyContainer,
        ],
        arenaForText: collapseBodyContainer as ArenaWithText,
        allowedArenas: [
          collapseTitleParagraph,
          collapseBodyContainer,
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

export default collapsePlugin;
