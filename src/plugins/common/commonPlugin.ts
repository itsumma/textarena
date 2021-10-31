import Textarena from '../../Textarena';
import { ArenaPlugin } from '../../interfaces';
import { ArenaSelection } from '../../helpers';
import { isMac } from '../../utils/navigator';
import { breakSelection } from './breakFunctions';
import { deleteBackward, deleteForward } from './removeFunctions';

export const commonPlugin: () => ArenaPlugin = () => ({
  register(textarena: Textarena): void {
    textarena.registerCommand(
      'breakSelection',
      breakSelection,
    );
    textarena.registerShortcut(
      'Enter',
      'breakSelection',
    );
    textarena.registerShortcut(
      'NumpadEnter',
      'breakSelection',
    );
    textarena.registerShortcut(
      'Ctrl + Enter',
      'breakSelection',
    );
    textarena.registerCommand(
      'deleteBackward',
      deleteBackward,
    );
    textarena.registerShortcut(
      'Backspace',
      'deleteBackward',
    );
    textarena.registerCommand(
      'deleteForward',
      deleteForward,
    );
    textarena.registerShortcut(
      'Delete',
      'deleteForward',
    );
    textarena.registerCommand(
      'deleteWordBack',
      (ta: Textarena, selection: ArenaSelection) => {
        const { node, offset } = selection.getCursor();
        if (selection.isCollapsed() && node.hasText) {
          const wholeText = node.getRawText();
          const text = wholeText.slice(0, offset);
          const match = text.match(/([^\s]+\s*)$/g);
          if (match) {
            const newOffset = offset - match[0].length;
            node.removeText(newOffset, offset);
            selection.setCursor({ node, offset: newOffset });
            return selection;
          }
        }
        return ta.removeSelection(selection);
      },
    );
    textarena.registerShortcut(
      'Ctrl + Backspace',
      'deleteWordBack',
    );
    textarena.registerShortcut(
      'Alt + Backspace',
      'deleteWordBack',
    );
    textarena.registerCommand(
      'deleteWordForward',
      (ta: Textarena, selection: ArenaSelection) => {
        const { node, offset } = selection.getCursor();
        if (selection.isCollapsed() && node.hasText) {
          const wholeText = node.getRawText();
          const text = wholeText.slice(offset);
          const match = text.match(/^(\s*[^\s]+)/g);
          if (match) {
            node.removeText(offset, offset + match[0].length);
            return selection;
          }
        }
        return ta.removeSelection(selection);
      },
    );
    textarena.registerShortcut(
      'Ctrl + Delete',
      'deleteWordForward',
    );
    textarena.registerShortcut(
      'Alt + Delete',
      'deleteWordForward',
    );
    textarena.registerCommand(
      'moveChildUp',
      (ta: Textarena, selection: ArenaSelection) => ta.moveChild(selection, 'up'),
    );
    textarena.registerShortcut(
      `${isMac() ? 'Meta' : 'Alt'} + Shift + ArrowUp`,
      'moveChildUp',
      'Сдвинуть блок вверх',
    );
    textarena.registerCommand(
      'moveChildDown',
      (ta: Textarena, selection: ArenaSelection) => ta.moveChild(selection, 'down'),
    );
    textarena.registerShortcut(
      `${isMac() ? 'Meta' : 'Alt'} + Shift + ArrowDown`,
      'moveChildDown',
      'Сдвинуть блок вниз',
    );
  },
});
