import ArenaSelection from '../../helpers/ArenaSelection';
import { ArenaInlineInterface } from '../../interfaces/Arena';
import CommandAction from '../../interfaces/CommandAction';
import Textarena from '../../Textarena';
import ElementHelper from '../../helpers/ElementHelper';
import { ArenaNodeInline } from '../../interfaces/ArenaNode';
import TextNode from '../../models/TextNode';

export default function linkCommand(
  arena: ArenaInlineInterface, linkModal: ElementHelper | undefined,
): CommandAction {
  return (ta: Textarena, selection: ArenaSelection) => {
    let link = '';
    let oldNode: ArenaNodeInline | undefined;
    const inlinePair = ta.getInlineNode(selection, arena);
    if (inlinePair) {
      [, oldNode] = inlinePair;
      const oldLink = oldNode.getAttribute('href');
      link = typeof oldLink === 'string' ? oldLink : '';
    }
    linkModal?.setProperty('url', link);
    const { startNode, startOffset, endOffset } = selection;
    if (startNode instanceof TextNode) {
      linkModal?.setProperty('text', startNode.getRawText().slice(startOffset, endOffset));
    }
    linkModal?.setProperty('show', true);
    return new Promise<ArenaSelection>((r) => {
      linkModal?.setProperty('saveCB', (newHref: string, _text: string) => {
        if (newHref) {
          selection.trim();
          if (oldNode) {
            ta.updateInlineNode(selection, oldNode);
            oldNode.setAttribute('href', newHref);
          } else {
            const node = ta.addInlineNode(selection, arena);
            if (node) {
              node.setAttribute('href', newHref);
              node.setAttribute('target', '_blank');
            }
          }
        } else if (oldNode) {
          ta.removeInlineNode(selection, oldNode);
        }
        return r(selection);
      });
    });
  };
}
