import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import Arena, {
  ArenaWithChildText, ArenaWithNodes,
} from 'interfaces/Arena';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import RichTextManager from 'RichTextManager';
import AbstractNodeAncestor from './AbstractNodeAncestor';

// TODO сделать вариант когда у нас фиксированное количество дочерних нод,
// например callout (title, paragraph)
// или quote (title, section).

export default class MediatorNode
  extends AbstractNodeAncestor
  implements ArenaNodeScion, ArenaNodeAncestor {
  hasParent: true = true;

  constructor(
    arena: ArenaWithNodes | ArenaWithChildText,
    public parent: ArenaNodeAncestor,
  ) {
    super(arena);
  }

  getIndex(): number {
    return this.parent.children.indexOf(this);
  }

  getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  insertText(
    text: string | RichTextManager,
    offset: number,
  ): [ArenaNode, number] | undefined {
    const result = super.insertText(text, offset);
    if (result) {
      return result;
    }
    return this.parent.insertText(text, this.getIndex() + 1);
  }

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNode, ArenaNode, number,
  ] | undefined {
    const result = super.createAndInsertNode(arena, offset);
    if (result) {
      return result;
    }
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  }

  remove(): void {
    this.parent.removeChild(this.getIndex());
  }
}
