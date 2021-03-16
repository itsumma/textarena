import Textarena from 'Textarena';
import ArenaSelection from 'helpers/ArenaSelection';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaCursor from 'interfaces/ArenaCursor';
import ArenaWithText from 'interfaces/ArenaWithText';
import ArenaNode from 'interfaces/ArenaNode';

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
      pattern: /^-\s+(.*)$/,
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
      pattern: /^\d+\.\s+(.*)$/,
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
        allowText: true,
        allowFormating: true,
        nextArena: undefined,
      },
      [
        {
          tag: item.tag,
          attributes: item.attributes,
        },
      ],
    );
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
          arenaForText: li as ArenaWithText,
          hasChildren: true,
          automerge: true,
        },
        [
          {
            tag,
            attributes,
          },
        ],
        [textarena.getRootArenaName()],
      );
      textarena.registerCommand(
        command,
        (ta: Textarena, selection: ArenaSelection) => ta.transformModel(selection, listArena),
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
        checkStatus: (node: ArenaNode):
          boolean => 'parent' in node && node.parent.arena === listArena,
      });
      textarena.registerCreator({
        name,
        title,
        icon,
        shortcut,
        command,
        hint,
      });
      (paragraph as ArenaWithText).registerMiddleware((cursor: ArenaCursor) => {
        const text = cursor.node.getRawText();
        const match = text.match(pattern);
        if (match) {
          const newNode = cursor.node.createAndInsertNode(listArena, 0);
          if (newNode) {
            const newCursor = newNode.insertText(match[1], 0);
            cursor.node.remove();
            return newCursor;
          }
        }
        return cursor;
      });
      textarena.addSimpleArenas(listArena);
    });
  },
});

export default listsPlugin;
