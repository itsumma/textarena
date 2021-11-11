import ArenaSelection from '../../helpers/ArenaSelection';
import { ArenaInlineInterface } from '../../interfaces/Arena';
import CommandAction from '../../interfaces/CommandAction';
import Textarena from '../../Textarena';
import ElementHelper from '../../helpers/ElementHelper';
import { ArenaNodeInline } from '../../interfaces/ArenaNode';
import TextNode from '../../models/TextNode';

export default function linkCommand(
  arena: ArenaInlineInterface,
  linkModal: ElementHelper | undefined,
): CommandAction {
  return (ta: Textarena, selection: ArenaSelection) => {
    if (!selection.isSameNode()) {
      return selection;
    }
    selection.trim();
    const { startNode } = selection;
    if (!(startNode instanceof TextNode)) {
      return selection;
    }
    let url = '';
    let oldNode: ArenaNodeInline | undefined;
    const interval = ta.getInlineInterval(selection);
    const inlinePair = ta.getInlineNode(selection, arena);
    if (selection.isCollapsed() && !inlinePair) {
      return selection;
    }
    if (inlinePair) {
      [, oldNode] = inlinePair;
      const oldHref = oldNode.getAttribute('href');
      url = typeof oldHref === 'string' ? oldHref : '';
    }
    linkModal?.setProperty('url', url);
    let startOffset: number;
    let endOffset: number;
    if (interval && (selection.isCollapsed() || (
      selection.startOffset > interval.start
      && selection.endOffset < interval.end
    ))) {
      startOffset = interval.start;
      endOffset = interval.end;
    } else {
      startOffset = selection.startOffset;
      endOffset = selection.endOffset;
    }
    const originalText = startNode.getRawText();
    linkModal?.setProperty('text', originalText.slice(startOffset, endOffset));
    linkModal?.setProperty('show', true);
    return new Promise<ArenaSelection>((r) => {
      linkModal?.setProperty('closeCB', () => r(selection));
      linkModal?.setProperty('saveCB', (newHref: string, newText: string) => {
        startNode.removeText(startOffset, endOffset);
        startNode.insertText(newText, startOffset, true);
        selection.setStartNode(startNode, startOffset);
        selection.setEndNode(startNode, startOffset + newText.length);
        if (newHref) {
          const node = ta.addInlineNode(selection, arena);
          if (node) {
            node.setAttribute('href', newHref);
            node.setAttribute('target', '_blank');
          }
        } else if (oldNode) {
          ta.removeInlineNode(selection, oldNode);
        }
        return r(selection);
      });
    });
  };
}
