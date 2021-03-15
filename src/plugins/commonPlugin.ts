import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaSelection from 'ArenaSelection';

const commonPlugin: ArenaPlugin = {
  register(textarena: Textarena): void {
    textarena.commandManager.registerCommand(
      'breakSelection',
      (ta: Textarena, selection: ArenaSelection) => ta.model.breakSelection(selection),
    );
    textarena.commandManager.registerShortcut(
      'Enter',
      'breakSelection',
    );
    textarena.commandManager.registerShortcut(
      'Ctrl + Enter',
      'breakSelection',
    );
    textarena.commandManager.registerCommand(
      'moveChildUp',
      (ta: Textarena, selection: ArenaSelection) => ta.model.moveChild(selection, 'up'),
    );
    textarena.commandManager.registerShortcut(
      'Alt + ArrowUp',
      'moveChildUp',
    );
    textarena.commandManager.registerCommand(
      'moveChildDown',
      (ta: Textarena, selection: ArenaSelection) => ta.model.moveChild(selection, 'down'),
    );
    textarena.commandManager.registerShortcut(
      'Alt + ArrowDown',
      'moveChildDown',
    );
  },
};

export default commonPlugin;
