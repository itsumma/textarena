import {
  LitElement, html, css, property, TemplateResult,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
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
      display: block;
      padding: 1.25rem;
      background: #f5f5f5!important;
      overflow: hidden;
      border: .5px solid #e6e6e6;
      box-sizing: border-box;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .incut_arrow {
      transition: .4s;
    }
    .incut_arrow.open {
      transform: rotate(-180deg);
    }
    .body {
      display: none;
    }
    .body.open {
      display: block;
    }
    `;

  protected open = false;

  handleClick(): void {
    this.open = !this.open;
    this.requestUpdate();
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    return html`
      <div class="stk-snippet stk-snippet-wrapper stk-container incut no-ad vrez-margins" data-ce-tag="container" data-container-name="Incut">
        <div class="stk-container my-outer-block incut_header" data-ce-tag="container">
          <slot name="title" class="stk-reset wp-exclude-emoji stk-theme_37074__style_medium_header incut_title">Заголовок</slot>
          <div @click="${this.handleClick} class="stk-container my-outer-block incut_svg" data-ce-tag="container">
            <svg
              class=${classMap({ 'incut_arrow': true, open: this.open })}
              width="18" height="9" viewbox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17 1.5L9 7.5L1 1.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
        </div>
        <slot name='body'
          class=${classMap({ 'body': true, open: this.open })}
        >Контент</slot>
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
