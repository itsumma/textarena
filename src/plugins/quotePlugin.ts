import {
  LitElement, html, css, property, TemplateResult,
} from 'lit-element';
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaMediatorInterface, ArenaTextInterface } from '../interfaces/Arena';
import { ArenaNodeText } from '../interfaces/ArenaNode';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import Textarena from '../Textarena';

// This decorator defines the element.
export class Quote extends LitElement {
  // This decorator creates a property accessor that triggers rendering and
  // an observed attribute.
  @property()
  mood = 'great';

  static styles = css`
    :host {
    }
    .line {
      display: flex;
      align-items: center;
      margin: 0.3rem 0.3rem 0.5rem ;
    }
    .quote_image {
      width: 2.3rem;
    }
    .author {
      flex: 1;
      margin-right: 1rem;
    }
  `;

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    return html`
      <div class="incut-plugin incut no-ad">
        <div class="line">
          <div class="author">
            <slot name="quote_author"></slot>
            <slot name="quote_role"></slot>
          </div>
          <div class="quote_image">
            <slot></slot>
          </div>
        </div>


        <div class="quote_author_role">
        </div>
        <div class="quote_text">
          <slot name="quote_body"></slot>
        </div>
      </div>
    `;
  }
}

type Options = {
  name: string;
  icon?: string;
  title: string;
  tag: string;
  attributes: string[];
  shortcut: string;
  hint: string;
  command: string;
  component: string;
};

const defaultOptions: Options = {
  name: 'quote',
  // icon: '<b>Q</b>',
  title: 'Цитата',
  tag: 'ARENA-QUOTE',
  attributes: ['class=textarena-quote'],
  shortcut: 'Alt + KeyQ',
  hint: 'q',
  command: 'add-quote',
  component: 'arena-quote',
};

const quotePlugin = (opts?: Options): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, shortcut, hint, command, component,
    } = {
      ...defaultOptions,
      ...(opts || {}),
    };
    if (!customElements.get(component)) {
      customElements.define(component, Quote);
    }
    const paragraph = textarena.getDefaultTextArena() as ArenaTextInterface;
    const image = textarena.getArena('image') as ArenaMediatorInterface;
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const allowedArenas = textarena.getSimpleArenas();
    const bodyContainer = textarena.registerArena(
      {
        name: 'quote-body-container',
        tag: 'QUOTE',
        attributes: ['slot=quote_body', 'class=body'],
        hasText: true,
        nextArena: paragraph,
      },
      [
        {
          tag: 'QUOTE',
          attributes: ['slot=quote_body'],
        },
      ],
      [],
    ) as ArenaMediatorInterface;

    const roleContainer = textarena.registerArena(
      {
        name: 'quote-role-container',
        tag: 'CITE',
        attributes: ['slot=quote_role', 'class=textarena-quote__role'],
        hasText: true,
        nextArena: paragraph,
      },
      [
        {
          tag: 'CITE',
          attributes: ['slot=quote_role'],
        },
      ],
      [],
    ) as ArenaTextInterface;

    const titleParagraph = textarena.registerArena(
      {
        name: 'quote-author-container',
        tag: 'CITE',
        attributes: ['slot=quote_author', 'class=textarena-quote__author'],
        hasText: true,
        nextArena: roleContainer,
      },
      [
        {
          tag: 'CITE',
          attributes: ['slot=quote_author'],
        },
      ],
      [],
    ) as ArenaTextInterface;
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        protectedChildren: [image, titleParagraph, roleContainer, bodyContainer],
        arenaForText: bodyContainer,
      },
      [
        {
          tag,
          attributes: [],
        },
      ],
      [textarena.getRootArenaName()],
    ) as ArenaMediatorInterface;
    textarena.registerCommand(command, (ta: Textarena, selection: ArenaSelection) => {
      const sel = ta.applyArenaToSelection(selection, arena);
      return sel;
    });

    // textarena.registerShortcut(shortcut, command);
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

export default quotePlugin;
