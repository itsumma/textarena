import { ArenaSelection } from '../../helpers';
import { ArenaModel } from '../../services';
import Textarena from '../../Textarena';

function deleteNonText(selection: ArenaSelection): ArenaSelection {
  return selection;
}
function deleteAtBegin(model: ArenaModel, selection: ArenaSelection): ArenaSelection {
  // At the begining of the text node
  const { node } = selection.getCursor();
  if (!node.hasText) {
    return selection;
  }
  const newSelection = selection;
  const newNode = model.getOutFromMediator(node, true);
  if (newNode) {
    newSelection.setBoth(newNode, 0);
  } else {
    // nowhere to get out
    const prevSibling = node.parent.getChild(node.getIndex() - 1);
    if (!prevSibling) {
      // TODO go to prev parent
      return newSelection;
    }
    if (prevSibling.hasChildren && prevSibling.protected) {
      const cursor = model.getOrCreateNodeForText(prevSibling);
      if (cursor) {
        if (node.getTextLength() === 0) {
          node.remove();
        }
        newSelection.setCursor(cursor);
      }
      return newSelection;
    }
    if (prevSibling.single) {
      if (node.hasText && node.getTextLength() === 0) {
        const resultCursor = node.remove();
        newSelection.setStartNode(resultCursor.node, resultCursor.offset - 1);
        newSelection.setEndNode(resultCursor.node, resultCursor.offset);
      } else {
        newSelection.setStartNode(prevSibling.parent, prevSibling.getIndex());
        newSelection.setEndNode(prevSibling.parent, prevSibling.getIndex() + 1);
      }
      return newSelection;
      // this.asm.eventManager.fire('removeNode', prevSibling);
      // prevSibling.remove();
    }
    if (prevSibling.hasText && prevSibling.getTextLength() === 0) {
      // this.asm.eventManager.fire('removeNode', prevSibling);
      prevSibling.remove();
      return newSelection;
    }
    // const cursor = prevSibling.getTextCursor(-1);
    const cursor = model.getOrCreateNodeForText(prevSibling);
    if (cursor) {
      if (node.getTextLength() !== 0) {
        cursor.node.insertText(node.getText(), cursor.offset);
      }
      // this.asm.eventManager.fire('removeNode', node);
      node.remove();
      newSelection.setCursor(cursor);
    }
  }
  return selection;
}

export function deleteBackward(textarena: Textarena, selection: ArenaSelection): ArenaSelection {
  const model = textarena.getModel();
  if (!selection.isCollapsed()) {
    return model.removeSelection(selection);
  }
  const { node, offset } = selection.getCursor();
  if (!node.hasText) {
    return deleteNonText(selection);
  }
  if (offset === 0) {
    return deleteAtBegin(model, selection);
  }
  node.removeText(offset - 1, offset);
  const newSelection = selection;
  newSelection.setBoth(node, offset - 1);
  return newSelection;
}

function deleteAtEnd(model: ArenaModel, selection: ArenaSelection): ArenaSelection {
  // const nextSibling = this.getNextSibling(node);
  const { node, offset } = selection.getCursor();
  if (!node.hasText) {
    return selection;
  }
  const newSelection = selection;
  const nextSibling = node.parent.getChild(node.getIndex() + 1);
  if (!nextSibling) {
    return newSelection;
  }
  if (nextSibling.hasChildren && nextSibling.protected) {
    const cursor = model.getOrCreateNodeForText(nextSibling, 0);
    if (cursor) {
      if (node.getTextLength() === 0) {
        node.remove();
      }
      newSelection.setCursor(cursor);
    }
    return newSelection;
  }
  if (nextSibling.single) {
    // this.asm.eventManager.fire('removeNode', nextSibling);
    if (offset === 0) {
      const resultCursor = node.remove();
      newSelection.setStartNode(resultCursor.node, resultCursor.offset);
      newSelection.setEndNode(resultCursor.node, resultCursor.offset + 1);
    } else {
      newSelection.setStartNode(nextSibling.parent, nextSibling.getIndex());
      newSelection.setEndNode(nextSibling.parent, nextSibling.getIndex() + 1);
    }
    return newSelection;
  }
  const cursor = model.getOrCreateNodeForText(nextSibling, 0);
  // const cursor = nextSibling.getTextCursor(0);
  if (cursor) {
    if (node.getTextLength() === 0) {
      // this.asm.eventManager.fire('removeNode', node);
      node.remove();
      newSelection.setCursor(cursor);
    } else {
      node.insertText(cursor.node.cutText(0), offset);
      // this.asm.eventManager.fire('removeNode', node);
      cursor.node.remove();
    }
  }
  return newSelection;
}

export function deleteForward(textarena: Textarena, selection: ArenaSelection): ArenaSelection {
  const model = textarena.getModel();
  if (!selection.isCollapsed()) {
    return model.removeSelection(selection);
  }
  const { node, offset } = selection.getCursor();
  if (!node.hasText) {
    return deleteNonText(selection);
  }
  if (node.getTextLength() === offset) {
    return deleteAtEnd(model, selection);
  }
  node.removeText(offset, offset + 1);
  return selection;
}
