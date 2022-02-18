import {
  ArenaNodeText,
} from '../interfaces';

function getTrimmedOffsets(
  node: ArenaNodeText,
  start?: number,
  end?: number,
): [number, number] {
  const startOffset = start || 0;
  let trimStartOffset = startOffset;
  const endOffset = end || node.getTextLength();
  let trimEndOffset = endOffset;
  const text = node.getRawText().slice(startOffset, endOffset);
  if (start !== undefined) {
    const matchA = text.match(/^( +)/g);
    if (matchA) {
      const len = matchA[0].length;
      trimStartOffset = Math.min(startOffset + len, endOffset);
    }
  }

  if (end !== undefined) {
    const matchB = text.match(/( +)$/g);
    if (matchB) {
      const len = matchB[0].length;
      trimEndOffset = Math.max(endOffset - len, startOffset);
    }
  }
  return [trimStartOffset, trimEndOffset];
}

export function toggleFormating(
  formating: string,
  node: ArenaNodeText,
  start?: number,
  end?: number,
): void {
  const startOffset = start || 0;
  const endOffset = end || node.getTextLength();
  const [trimStartOffset, trimEndOffset] = getTrimmedOffsets(node, start, end);
  if (trimStartOffset >= trimEndOffset) {
    return;
  }

  if (node.hasFormating(formating, trimStartOffset, trimEndOffset)) {
    node.removeFormating(formating, startOffset, endOffset);
  } else {
    node.insertFormating(formating, trimStartOffset, trimEndOffset);
  }
}

export function hasFormating(
  formating: string,
  node: ArenaNodeText,
  start?: number,
  end?: number,
): boolean {
  const [trimStartOffset, trimEndOffset] = getTrimmedOffsets(node, start, end);
  return node.hasFormating(formating, trimStartOffset, trimEndOffset);
}
