import {
  LitElement, html, css, customElement, property, TemplateResult,
} from 'lit-element';
import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import { ArenaMediatorInterface, ArenaTextInterface } from '../interfaces/Arena';
import { ArenaNodeText } from '../interfaces/ArenaNode';

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

const calloutPlugin = (opts?: typeof defaultOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, shortcut, hint, command,
    } = { ...defaultOptions, ...(opts || {}) };
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const allowedArenas = textarena.getSimpleArenas();
    const calloutBodyContainer = textarena.registerArena(
      {
        name: 'callout-body-container',
        tag: 'ARENA-CALLOUT-BODY',
        attributes: [
          'slot=body',
        ],
        hasChildren: true,
        allowedArenas,
        arenaForText: paragraph as ArenaTextInterface,
      },
      [
        {
          tag: 'ARENA-CALLOUT-BODY',
          attributes: [
            'slot=body',
          ],
        },
      ],
      [],
    ) as ArenaMediatorInterface;
    const calloutTitleParagraph = textarena.registerArena(
      {
        name: 'callout-title-paragraph',
        tag: 'P',
        attributes: [
          'slot=title',
        ],
        hasText: true,
        nextArena: paragraph,
      },
      [
        {
          tag: 'P',
          attributes: [
            'slot=title',
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
        protectedChildren: [
          calloutTitleParagraph,
          calloutBodyContainer,
        ],
        arenaForText: calloutBodyContainer,
      },
      [
        {
          tag,
          attributes: [],
        },
      ],
      [textarena.getRootArenaName()],
    ) as ArenaMediatorInterface;
    textarena.registerCommand(
      command,
      (ta: Textarena, selection: ArenaSelection) => {
        const sel = ta.applyArenaToSelection(selection, arena);
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

export default calloutPlugin;
