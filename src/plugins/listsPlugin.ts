import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';
import ArenaSelection from 'ArenaSelection';
import { ArenaWithText } from 'interfaces/Arena';

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
  },
};

export default listsPlugin;
