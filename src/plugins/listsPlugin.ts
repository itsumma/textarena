import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaCursorText from '../interfaces/ArenaCursorText';
import { ArenaMediatorInterface, ArenaTextInterface } from '../interfaces/Arena';
import { ArenaNodeText, ChildArenaNode } from '../interfaces/ArenaNode';

type ListOptions = {
  name: string,
  tag: string,
  attributes: string[],
  title: string,
  icon: string;
  shortcut: string,
  command: string,
  hint: string,
  pattern: RegExp,
};

type ListsOptions = {
  item: {
    name: string,
    tag: string,
    attributes: string[],
  },
  lists: ListOptions[],
};

const defaultOptions: ListsOptions = {
  item: {
    name: 'li',
    tag: 'LI',
    attributes: [],
  },
  lists: [
    {
      name: 'unordered-list',
      tag: 'UL',
      attributes: [],
      title: 'List',
      icon: '≣',
      shortcut: 'Alt + KeyL',
      command: 'convert-to-unordered-list',
      hint: 'l',
      pattern: /^(-\s+).*$/,
    },
    {
      name: 'ordered-list',
      tag: 'OL',
      attributes: [],
      title: 'Ordered list',
      icon: '<b>1.</b>',
      shortcut: 'Alt + KeyO',
      command: 'convert-to-ordered-list',
      hint: 'o',
      pattern: /^(\d+(?:\.|\))\s+).*$/,
    },
  ],
};

const listsPlugin = (opts?: ListsOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const {
      item,
      lists,
    } = { ...defaultOptions, ...(opts || {}) };
    const li = textarena.registerArena(
      {
        ...item,
        hasText: true,
        nextArena: undefined,
      },
      [
        {
          tag: item.tag,
          attributes: item.attributes,
        },
      ],
    ) as ArenaTextInterface;
    lists.forEach(({
      name,
      tag,
      attributes,
      title,
      icon,
      shortcut,
      command,
      hint,
      pattern,
    }) => {
      const listArena = textarena.registerArena(
        {
          name,
          tag,
          attributes,
          allowedArenas: [li],
          arenaForText: li,
          automerge: true,
          group: true,
        },
        [
          {
            tag,
            attributes,
          },
        ],
        [textarena.getRootArenaName()],
      ) as ArenaMediatorInterface;
      textarena.registerCommand(
        command,
        (ta: Textarena, selection: ArenaSelection) =>
          ta.applyArenaToSelection(selection, listArena),
      );
      textarena.registerShortcut(
        shortcut,
        command,
      );
      textarena.registerTool({
        name,
        title,
        icon,
        shortcut,
        command,
        hint,
        checkStatus: (node: ChildArenaNode):
          boolean => 'parent' in node && node.parent.arena === listArena,
      });
      textarena.registerCreator({
        name,
        title,
        icon,
        shortcut,
        command,
        hint,
        canShow: (node: ArenaNodeText) =>
          node.parent.arena.allowedArenas.includes(listArena),
      });
      if (paragraph.hasText) {
        paragraph.registerMiddleware((ta: Textarena, cursor: ArenaCursorText) => {
          const text = cursor.node.getRawText();
          const match = text.match(pattern);
          if (match) {
            const sel = new ArenaSelection(
              cursor.node,
              cursor.offset,
              cursor.node,
              cursor.offset,
              'forward',
            );
            const newSel = ta.applyArenaToSelection(sel, listArena);
            const cursor2 = newSel.getCursor();
            cursor2.node.cutText(0, match[1].length);
            cursor2.offset = 0;
            return cursor2;
          }
          return cursor;
        });
      }
      textarena.addSimpleArenas(listArena);
    });
  },
});

export default listsPlugin;
