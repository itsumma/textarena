import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';
import ArenaSelection from 'ArenaSelection';
import { ArenaWithText, Middleware } from 'interfaces/Arena';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaCursor from 'interfaces/ArenaCursor';
import ArenaNodeText from 'interfaces/ArenaNodeText';

const defaultOptions = {
};

const listsPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: any): void {
    const options = { ...defaultOptions, ...(opts || {}) };
    const li = textarena.model.registerArena(
      {
        name: 'li',
        tag: 'LI',
        attributes: [],
        allowText: true,
        allowFormating: true,
        nextArena: undefined,
      },
      [
        {
          tag: 'LI',
          attributes: [],
        },
      ],
    );
    const ul = textarena.model.registerArena(
      {
        name: 'ul',
        tag: 'UL',
        attributes: [],
        allowedArenas: [li],
        arenaForText: li as ArenaWithText,
        hasChildren: true,
      },
      [
        {
          tag: 'UL',
          attributes: [],
        },
      ],
      [ArenaModel.rootArenaName],
    );
    textarena.commandManager.registerCommand(
      'convert-to-list',
      (ta: Textarena, selection: ArenaSelection) => ta.model.transformModel(selection, ul),
    );
    textarena.commandManager.registerShortcut(
      'Alt + KeyL',
      'convert-to-list',
    );
    textarena.toolbar.registerTool({
      name: 'list',
      title: 'List',
      icon: '≣',
      shortcut: 'Alt + KeyL',
      command: 'convert-to-list',
      hint: 'l',
    });
    const ol = textarena.model.registerArena(
      {
        name: 'ol',
        tag: 'OL',
        attributes: [],
        allowedArenas: [li],
        arenaForText: li as ArenaWithText,
        hasChildren: true,
      },
      [
        {
          tag: 'OL',
          attributes: [],
        },
      ],
      [ArenaModel.rootArenaName],
    );
    textarena.commandManager.registerCommand(
      'convert-to-ordered-list',
      (ta: Textarena, selection: ArenaSelection) => ta.model.transformModel(selection, ol),
    );
    textarena.commandManager.registerShortcut(
      'Alt + KeyO',
      'convert-to-ordered-list',
    );
    textarena.toolbar.registerTool({
      name: 'ordered-list',
      title: 'Ordered list',
      icon: '<b>1.</b>',
      shortcut: 'Alt + KeyO',
      command: 'convert-to-ordered-list',
      hint: 'o',
    });
    const paragraph = textarena.model.getArena('paragraph');
    if (!paragraph) {
      throw new Error('Arena "paragraph" not found');
    }
    (paragraph as ArenaWithText).registerMiddleware((cursor: ArenaCursor) => {
      const text = cursor.node.getRawText();
      if (/^\d+\. $/.test(text)) {
        const newNode = cursor.node.createAndInsertNode(ol, 0);
        if (newNode) {
          const newCursor = newNode.insertText('', 0);
          cursor.node.remove();
          return newCursor;
        }
      }
      if (/^- $/.test(text)) {
        const newNode = cursor.node.createAndInsertNode(ul, 0);
        if (newNode) {
          const newCursor = newNode.insertText('', 0);
          cursor.node.remove();
          return newCursor;
        }
      }
      return cursor;
    });
  },
};

export default listsPlugin;
