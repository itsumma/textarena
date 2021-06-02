import ArenaSelection from '../helpers/ArenaSelection';
import ArenaCursor from '../interfaces/ArenaCursor';
import { AnyArenaNode } from '../interfaces/ArenaNode';

export function getAncestors(cursor: ArenaCursor): ArenaCursor[] {
  const { node } = cursor;
  if (node.hasParent) {
    const parentCursor = node.getParent();
    return [
      ...getAncestors(parentCursor),
      cursor,
    ];
  }
  return [cursor];
}

export function getCommonAncestor(cursorA: ArenaCursor, cursorB: ArenaCursor):
    [ AnyArenaNode, number, number ] {
  if (cursorA.node === cursorB.node) {
    return [
      cursorA.node,
      Math.min(cursorA.offset, cursorB.offset),
      Math.max(cursorA.offset, cursorB.offset),
    ];
  }
  const ancestorsForA = getAncestors(cursorA);
  const ancestorsForB = getAncestors(cursorB);
  const commonMaxDeep = Math.min(ancestorsForA.length, ancestorsForB.length);
  let result: [ AnyArenaNode, number, number ] | undefined;
  for (let i = 0; i < commonMaxDeep; i += 1) {
    if (ancestorsForA[i].node === ancestorsForB[i].node) {
      result = [
        ancestorsForA[i].node,
        Math.min(ancestorsForA[i].offset, ancestorsForB[i].offset),
        Math.max(ancestorsForA[i].offset, ancestorsForB[i].offset),
      ];
    } else {
      break;
    }
  }
  if (!result) {
    throw new Error('Can\'t find common ancestor for nodes');
  }
  return result;
}

/**
  * Call callback function for all selected nodes without any child nodes.
  * @param selection ArenaSelection
  * @param callback (node: AnyArenaNode, start?: number, end?: number) => void
  * @returns Common ancestor with start and end indexes of selected nodes.
  */
export function runThroughSelection(
  selection: ArenaSelection,
  callback?: (node: AnyArenaNode, start?: number, end?: number) => void,
): [ AnyArenaNode, number, number ] | undefined {
  const {
    startNode,
    startOffset,
    endOffset,
  } = selection;
  if (selection.isSameNode()) {
    if (callback) {
      callback(startNode, startOffset, endOffset);
    }
    if (startNode.hasParent) {
      const index = startNode.getIndex();
      return [startNode.parent, index, index];
    }
    return [startNode, startOffset, endOffset];
  }
  let startCursor: ArenaCursor = selection.getStartCursor();
  let endCursor: ArenaCursor = selection.getEndCursor();
  const commonAncestorCursor = getCommonAncestor(
    startCursor,
    endCursor,
  );
  if (!commonAncestorCursor) {
    return undefined;
  }
  if (!callback) {
    return commonAncestorCursor;
  }
  const [commonAncestor, commonStart, commonEnd] = commonAncestorCursor;

  const startNodes: [AnyArenaNode, number | undefined, number | undefined ][] = [];
  if (startCursor.node !== commonAncestor) {
    startNodes.push([startCursor.node, startCursor.offset, undefined]);
  }
  while (startCursor.node.hasParent) {
    startCursor = startCursor.node.getParent();
    if (startCursor.node === commonAncestor) {
      break;
    }
    if (startCursor.node.hasChildren) {
      const len = startCursor.node.children.length;
      for (let i = startCursor.offset + 1; i < len; i += 1) {
        const child = startCursor.node.getChild(i);
        if (child) {
          startNodes.push([child, undefined, undefined]);
        }
      }
    }
  }

  const endNodes: [AnyArenaNode, number | undefined, number | undefined ][] = [];
  if (endCursor.node !== commonAncestor) {
    endNodes.push([endCursor.node, undefined, endCursor.offset]);
  }
  while (endCursor.node.hasParent) {
    endCursor = endCursor.node.getParent();
    if (endCursor.node === commonAncestor) {
      break;
    }
    if (endCursor.node.hasChildren) {
      for (let i = endCursor.offset - 1; i >= 0; i -= 1) {
        const child = endCursor.node.getChild(i);
        if (child) {
          endNodes.push([child, undefined, undefined]);
        }
      }
    }
  }

  // callback(startNode, startOffset);
  startNodes.forEach((n) => callback(...n));
  let i = commonStart + 1;
  if (startNode === commonAncestor) {
    i = commonStart;
  }
  if (commonStart < commonEnd && commonAncestor.hasChildren) {
    for (i; i < commonEnd; i += 1) {
      const child = commonAncestor.getChild(i);
      if (child) {
        callback(child);
      }
    }
  }
  endNodes.reverse().forEach((n) => callback(...n));
  // callback(endNode, undefined, endOffset);
  return commonAncestorCursor;
}

/** */
export function runOfChildren(node: AnyArenaNode, callback: (n: AnyArenaNode) => void): void {
  if (node.hasChildren) {
    node.children.forEach((child) => {
      runOfChildren(child, callback);
    });
  } else {
    callback(node);
  }
}
