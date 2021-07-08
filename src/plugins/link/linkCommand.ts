import ArenaSelection from '../../helpers/ArenaSelection';
import { ArenaInlineInterface } from '../../interfaces/Arena';
import CommandAction from '../../interfaces/CommandAction';
import Textarena from '../../Textarena';

export default function linkCommand(arena: ArenaInlineInterface): CommandAction {
  return (ta: Textarena, selection: ArenaSelection) => {
    let link = '';
    let oldNode;
    const inlinePair = ta.getInlineNode(selection, arena);
    if (inlinePair) {
      [, oldNode] = inlinePair;
      const oldLink = oldNode.getAttribute('href');
      link = typeof oldLink === 'string' ? oldLink : '';
    }
    // eslint-disable-next-line no-alert
    const input = prompt('Укажите ссылку', link);
    if (input === null) {
      return selection;
    }
    link = input;
    if (link) {
      selection.trim();
      if (oldNode) {
        ta.updateInlineNode(selection, oldNode);
        oldNode.setAttribute('href', link);
      } else {
        const node = ta.addInlineNode(selection, arena);
        if (node) {
          node.setAttribute('href', link);
          node.setAttribute('target', '_blank');
        }
      }
    } else if (oldNode) {
      ta.removeInlineNode(selection, oldNode);
    }
    return selection;
  };
}
