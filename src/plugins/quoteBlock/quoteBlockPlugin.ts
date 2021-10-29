import ArenaSelection from '../../helpers/ArenaSelection';
import { ArenaMediatorInterface, ArenaTextInterface } from '../../interfaces/Arena';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import ArenaPlugin, { DefaulPluginOptions } from '../../interfaces/ArenaPlugin';
import Textarena from '../../Textarena';
import ArenaQuoteBlock from './ArenaQuoteBlock';
import outputQuoteBlock from './outputQuoteBlock';

const defaultOptions: DefaulPluginOptions = {
  name: 'quote-block',
  // icon: '<b>Q</b>',
  title: 'Блок с цитатой',
  tag: 'ARENA-QUOTE-BLOCK',
  attributes: { class: 'quote-block' },
  shortcut: 'Ctrl + Alt + 8',
  command: 'add-quote-block',
  component: 'arena-quote-block',
  componentConstructor: ArenaQuoteBlock,
  marks: [
    {
      tag: 'ARENA-QUOTE-BLOCK',
      attributes: [],
    },
    {
      tag: 'ARENA-QUOTE',
      attributes: [],
    },
    {
      tag: 'BLOCKQUOTE',
      attributes: ['class="quote-block"'],
    },
  ],
  output: outputQuoteBlock,
};

const srcset = [
  {
    media: '(max-width: 600px)',
    rations: [
      {
        ratio: 1,
        width: 200,
        height: 200,
      },
      {
        ratio: 2,
        width: 400,
        height: 400,
      },
    ],
  },
  {
    media: '',
    rations: [
      {
        ratio: 1,
        width: 100,
        height: 100,
      },
      {
        ratio: 2,
        width: 200,
        height: 200,
      },
      {
        ratio: 4,
        width: 400,
        height: 400,
      },
    ],
  },
];

const quotePlugin = (opts?: Partial<DefaulPluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, shortcut, command,
      component, componentConstructor, marks, output,
    } = {
      ...defaultOptions,
      ...(opts || {}),
    };
    if (component && componentConstructor && !customElements.get(component)) {
      customElements.define(component, componentConstructor);
    }
    const paragraph = textarena.getDefaultTextArena() as ArenaTextInterface;
    const image = textarena.getArena('image') as ArenaMediatorInterface;
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    // const allowedArenas = textarena.getSimpleArenas();
    const bodyContainer = textarena.registerArena(
      {
        name: 'quote-body-container',
        tag: 'QUOTE',
        attributes: { slot: 'quote_body', class: 'quote-block__body' },
        hasText: true,
        nextArena: paragraph,
        getPlain: (text: string) => `«${text}»`,
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
        attributes: { slot: 'quote_role', class: 'quote-block__role' },
        hasText: true,
        nextArena: bodyContainer,
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
        attributes: { slot: 'quote_author', class: 'quote-block__author' },
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
        protectedChildren: [
          [image, {
            width: 200, height: 200, srcset, class: 'quote-block__image',
          }],
          [titleParagraph, {}, 'Автор цитаты'],
          [roleContainer, {}, 'Роль'],
          [bodyContainer, {}, 'Цитата…'],
        ],
        arenaForText: bodyContainer,
        output,
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaMediatorInterface;

    if (command) {
      textarena.registerCommand(command, (ta: Textarena, selection: ArenaSelection) => {
        const [sel] = ta.insertBeforeSelected(selection, arena);
        return sel;
      });

      // textarena.registerShortcut(shortcut, command);
      if (title) {
        textarena.registerCreator({
          name,
          icon,
          title,
          shortcut,
          command,
          canShow: (node: AnyArenaNode) =>
            textarena.isAllowedNode(node, arena),
        });
      }
    }
  },
});

export default quotePlugin;
