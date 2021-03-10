import {
  LitElement, html, css, customElement, property, TemplateResult,
} from 'lit-element';
import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';
import ArenaSelection from 'ArenaSelection';
import { ArenaWithText } from 'interfaces/Arena';
import ArenaNode from 'interfaces/ArenaNode';

// This decorator defines the element.
@customElement('arena-callout')
export class Callout extends LitElement {
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
    return html`<div>
      <div class="nb">N. B.</div>
      <slot name="title"></slot>
      <div class="hr">n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.n.b.</div>
      <slot name="body"></slot>
    </div>`;
  }
}

const defaultOptions = {
  name: 'callout',
  icon: '<b>NB</b>',
  title: 'Callout',
  tag: 'ARENA-CALLOUT',
  attributes: [],
  shortcut: 'Alt + KeyC',
  hint: 'c',
  command: 'add-callout',
};

const calloutPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: typeof defaultOptions): void {
    const {
      name, icon, title, tag, attributes, shortcut, hint, command,
    } = { ...defaultOptions, ...(opts || {}) };
    const paragraph = textarena.model.getArena('paragraph');
    if (!paragraph) {
      throw new Error('Paragraph not found');
    }
    const ol = textarena.model.getArena('ol');
    const ul = textarena.model.getArena('ul');
    const allowedArenas = [
      paragraph,
    ];
    if (ol) {
      allowedArenas.push(ol);
    }
    if (ul) {
      allowedArenas.push(ul);
    }
    const calloutBodyContainer = textarena.model.registerArena(
      {
        name: 'callout-body-container',
        tag: 'ARENA-CALLOUT-BODY',
        attributes: [
          'slot=body',
        ],
        hasChildren: true,
        allowedArenas,
        arenaForText: paragraph as ArenaWithText,
      },
      [
        {
          tag: 'ARENA-CALLOUT-BODY',
          attributes: [
            'slot=body',
          ],
        },
      ],
      [ArenaModel.rootArenaName],
    );
    const calloutTitleParagraph = textarena.model.registerArena(
      {
        name: 'callout-title-paragraph',
        tag: 'P',
        attributes: [
          'slot=title',
        ],
        allowText: true,
        allowFormating: true,
        nextArena: calloutBodyContainer,
      },
      [
        {
          tag: 'P',
          attributes: [
            'slot=title',
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
          calloutBodyContainer,
        ],
        arenaForText: calloutBodyContainer as ArenaWithText,
        allowedArenas: [
          calloutTitleParagraph,
          calloutBodyContainer,
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

export default calloutPlugin;
