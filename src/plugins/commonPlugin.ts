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
  },
};

export default commonPlugin;
