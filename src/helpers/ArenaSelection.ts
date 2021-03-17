import ArenaNodeText from '../interfaces/ArenaNodeText';
import ArenaCursor from '../interfaces/ArenaCursor';

export type ArenaSelectionDiection = 'forward' | 'backward';

export default class ArenaSelection {
  constructor(
    public startNode: ArenaNodeText,
    public startOffset: number,
    public endNode: ArenaNodeText,
    public endOffset: number,
    public direction: ArenaSelectionDiection,
  ) {
  }

  setStartNode(
    startNode: ArenaNodeText,
    startOffset: number,
  ): ArenaSelection {
    this.startNode = startNode;
    this.startOffset = startOffset;
    return this;
  }

  setEndNode(
    endNode: ArenaNodeText,
    endOffset: number,
  ): ArenaSelection {
    this.endNode = endNode;
    this.endOffset = endOffset;
    return this;
  }

  setBoth(
    node: ArenaNodeText,
    offset: number,
  ): ArenaSelection {
    return this.setStartNode(node, offset).setEndNode(node, offset);
  }

  getCursor(): ArenaCursor {
    return {
      node: this.direction === 'forward' ? this.endNode : this.startNode,
      offset: this.direction === 'forward' ? this.endOffset : this.startOffset,
    };
  }

  setCursor(cursor: ArenaCursor): ArenaSelection {
    return this.setBoth(cursor.node, cursor.offset);
  }

  isCollapsed(): boolean {
    return this.startNode === this.endNode && this.startOffset === this.endOffset;
  }

  isSameNode(): boolean {
    return this.startNode === this.endNode;
  }

  isSelectionOnBegin(): boolean {
    return this.startOffset === 0;
  }

  isSelectionOnEnd(): boolean {
    return this.endNode.getTextLength() === this.endOffset;
  }

  collapse(): ArenaSelection {
    if (this.startNode === this.endNode) {
      this.endOffset = this.startOffset;
      return this;
    }
    if (this.direction === 'forward') {
      this.startNode = this.endNode;
      this.endOffset = 0;
      this.startOffset = 0;
    } else {
      this.endNode = this.startNode;
      this.endOffset = this.startOffset;
    }
    return this;
  }

  collapseBackward(): ArenaSelection {
    this.endNode = this.startNode;
    this.endOffset = this.startOffset;
    return this;
  }
}
