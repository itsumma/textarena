import { AnyArenaNode, ArenaCursor } from '../interfaces';

export type ArenaSelectionDiection = 'forward' | 'backward';

export class ArenaSelection {
  constructor(
    public startNode: AnyArenaNode,
    public startOffset: number,
    public endNode: AnyArenaNode,
    public endOffset: number,
    public direction: ArenaSelectionDiection,
  ) {
  }

  clone(): ArenaSelection {
    return new ArenaSelection(
      this.startNode,
      this.startOffset,
      this.endNode,
      this.endOffset,
      this.direction,
    );
  }

  setStartNode(
    startNode: AnyArenaNode,
    startOffset: number,
  ): ArenaSelection {
    this.startNode = startNode;
    this.startOffset = startOffset;
    return this;
  }

  setEndNode(
    endNode: AnyArenaNode,
    endOffset: number,
  ): ArenaSelection {
    this.endNode = endNode;
    this.endOffset = endOffset;
    return this;
  }

  setBoth(
    node: AnyArenaNode,
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

  getStartCursor(): ArenaCursor {
    return {
      node: this.startNode,
      offset: this.startOffset,
    };
  }

  getEndCursor(): ArenaCursor {
    return {
      node: this.endNode,
      offset: this.endOffset,
    };
  }

  isCollapsed(): boolean {
    return this.startNode === this.endNode && this.startOffset === this.endOffset;
  }

  isSameNode(): boolean {
    return this.startNode === this.endNode;
  }

  // isSelectionOnBegin(): boolean {
  //   return this.startOffset === 0;
  // }

  // isSelectionOnEnd(): boolean {
  //   return this.endNode.hasText && this.endNode.getTextLength() === this.endOffset;
  // }

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

  trim(): ArenaSelection {
    if (this.isCollapsed()) {
      return this;
    }
    if (this.startNode.hasText) {
      const textA = this.startNode.getRawText().slice(this.startOffset);
      const matchA = textA.match(/^( +)/g);
      if (matchA) {
        const len = matchA[0].length;
        if (this.startNode !== this.endNode) {
          this.startOffset += len;
        } else {
          this.startOffset = Math.min(this.startOffset + len, this.endOffset);
        }
      }
    }
    if (this.endNode.hasText) {
      const textB = this.endNode.getRawText().slice(0, this.endOffset);
      const matchB = textB.match(/( +)$/g);
      if (matchB) {
        const len = matchB[0].length;
        if (this.startNode !== this.endNode) {
          this.endOffset -= len;
        } else {
          this.endOffset = Math.max(this.endOffset - len, this.startOffset);
        }
      }
    }
    return this;
  }
}
