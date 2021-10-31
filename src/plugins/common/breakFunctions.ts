import { ArenaSelection } from '../../helpers';
import { ArenaModel } from '../../services';
import Textarena from '../../Textarena';

function breakAtBegin(model: ArenaModel, selection: ArenaSelection): ArenaSelection {
  // At the begining of the text node
  const newSelection = selection;
  const { node } = selection.getCursor();
  if (!node.hasText) {
    return selection;
  }
  const { parent, arena } = node;
  const nextArena = arena.nextArena || arena;
  if (node.isEmpty()) {
    // Text is empty. Trying to get out from this node (ex. in a list)
    const outNode = model.getOutFromMediator(node);
    if (outNode) {
      newSelection.setBoth(outNode, 0);
    } else {
      // nowhere to get out
      const newNode = model.createAndInsertNode(nextArena, parent, node.getIndex() + 1);
      if (newNode) {
        // const cursor = newNode.getTextCursor(0);
        const secondCursor = model.getOrCreateNodeForText(newNode, 0);
        if (secondCursor) {
          newSelection.setCursor(secondCursor);
        }
      }
    }
  } else {
    const newNode = model.createAndInsertNode(nextArena, parent, node.getIndex(), true);
    if (newNode) {
      model.getOrCreateNodeForText(newNode, 0);
    }
  }
  return newSelection;
}

/**
   * Remove selected nodes and split selected node in two nodes.
   * If current node is empty, try split uprotected parent in two
   * or get out of protected node, if cursor in the end of parent.
   * @param selection
   * @returns
   */
export function breakSelection(textarena: Textarena, selection: ArenaSelection): ArenaSelection {
  let newSelection = selection;
  const model = textarena.getModel();
  if (!selection.isCollapsed()) {
    newSelection = model.removeSelection(selection);
  }
  const cursor = newSelection.getCursor();
  const { node, offset } = cursor;
  if (!node.hasText) {
    const textCursor = model.getOrCreateNodeForText(node, offset, false, true);
    if (textCursor) {
      newSelection.setCursor(textCursor);
    }
    return newSelection;
  }
  const { parent, arena } = node;
  if (offset === 0) {
    return breakAtBegin(model, newSelection);
  }
  // const secondCursor = this.splitTextNode(cursor);
  // newSelection.setCursor();
  const nextArena = arena.nextArena || arena;
  const newNode = model.createAndInsertNode(nextArena, parent, node.getIndex() + 1);
  if (newNode) {
    const newCursor = model.getOrCreateNodeForText(newNode, 0);
    // const cursor = newNode.getTextCursor(0);
    if (newCursor) {
      const text = node.cutText(offset);
      const cursor2 = newCursor.node.insertText(text, newCursor.offset);
      newSelection.setCursor({ ...cursor2, offset: 0 });
    }
  }
  return newSelection;
}
