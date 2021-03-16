import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaSelection from 'helpers/ArenaSelection';

const commonPlugin: () => ArenaPlugin = () => ({
  register(textarena: Textarena): void {
    textarena.registerCommand(
      'breakSelection',
      (ta: Textarena, selection: ArenaSelection) => ta.breakSelection(selection),
    );
    textarena.registerShortcut(
      'Enter',
      'breakSelection',
    );
    textarena.registerShortcut(
      'Ctrl + Enter',
      'breakSelection',
    );
    textarena.registerCommand(
      'moveChildUp',
      (ta: Textarena, selection: ArenaSelection) => ta.moveChild(selection, 'up'),
    );
    textarena.registerShortcut(
      'Alt + ArrowUp',
      'moveChildUp',
    );
    textarena.registerCommand(
      'moveChildDown',
      (ta: Textarena, selection: ArenaSelection) => ta.moveChild(selection, 'down'),
    );
    textarena.registerShortcut(
      'Alt + ArrowDown',
      'moveChildDown',
    );
  },
});

export default commonPlugin;
