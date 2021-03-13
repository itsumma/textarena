import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';
import ArenaSelection from 'ArenaSelection';
import ArenaCursor from 'interfaces/ArenaCursor';
import ArenaWithText from 'interfaces/ArenaWithText';

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
      pattern: /^- /,
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
      pattern: /^\d+\. /,
    },
  ],
};

const listsPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: ListsOptions): void {
    const paragraph = textarena.model.getArena('paragraph');
    if (!paragraph) {
      throw new Error('Arena "paragraph" not found');
    }
    const {
      item,
      lists,
    } = { ...defaultOptions, ...(opts || {}) };
    const li = textarena.model.registerArena(
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
      const listArena = textarena.model.registerArena(
        {
          name,
          tag,
          attributes,
          allowedArenas: [li],
          arenaForText: li as ArenaWithText,
          hasChildren: true,
        },
        [
          {
            tag,
            attributes,
          },
        ],
        [ArenaModel.rootArenaName],
      );
      textarena.commandManager.registerCommand(
        command,
        (ta: Textarena, selection: ArenaSelection) => ta.model.transformModel(selection, listArena),
      );
      textarena.commandManager.registerShortcut(
        shortcut,
        command,
      );
      textarena.toolbar.registerTool({
        name,
        title,
        icon,
        shortcut,
        command,
        hint,
      });
      textarena.creatorBar.registerCreator({
        name,
        title,
        icon,
        shortcut,
        command,
        hint,
      });
      (paragraph as ArenaWithText).registerMiddleware((cursor: ArenaCursor) => {
        const text = cursor.node.getRawText();
        if (pattern.test(text)) {
          const newNode = cursor.node.createAndInsertNode(listArena, 0);
          if (newNode) {
            const newCursor = newNode.insertText('', 0);
            cursor.node.remove();
            return newCursor;
          }
        }
        return cursor;
      });
    });
  },
};

export default listsPlugin;
