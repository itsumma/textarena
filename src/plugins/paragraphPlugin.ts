import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';
import ArenaSelection from 'ArenaSelection';
import { ArenaWithText } from 'interfaces/Arena';

const defaultOptions = {
};

const paragraphPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: any): void {
    const options = { ...defaultOptions, ...(opts || {}) };
    const arena = textarena.model.registerArena(
      {
        name: 'paragraph',
        tag: 'P',
        attributes: [],
        allowText: true,
        allowFormating: true,
      },
      [
        {
          tag: 'P',
          attributes: [],
        },
        {
          tag: 'DIV',
          attributes: [],
        },
      ],
      [ArenaModel.rootArenaName],
    );
    textarena.model.rootArena.setArenaForText(arena as ArenaWithText);
    textarena.commandManager.registerCommand(
      'convert-to-paragraph',
      (ta: Textarena, selection: ArenaSelection) => ta.model.transformModel(selection, arena),
    );
    textarena.commandManager.registerShortcut(
      'Alt + Digit0',
      'convert-to-paragraph',
    );
    textarena.toolbar.registerTool({
      name: 'paragraph',
      title: 'Paragraph',
      icon: '<b>¶</b>',
      shortcut: 'Alt + Digit0',
      hint: '0',
      command: 'convert-to-paragraph',
    });
  },
};

export default paragraphPlugin;
