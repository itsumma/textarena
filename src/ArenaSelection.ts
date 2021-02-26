import ArenaNodeText from 'interfaces/ArenaNodeText';

export default class ArenaSelection {
  constructor(
    public startNode: ArenaNodeText,
    public startOffset: number,
    public endNode: ArenaNodeText,
    public endOffset: number,
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
}
