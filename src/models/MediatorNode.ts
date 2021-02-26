import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import Arena, {
  ArenaWithChildText, ArenaWithNodes,
} from 'interfaces/Arena';
import ArenaNodeCore from 'interfaces/ArenaNodeCore';
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

  getMyIndex(): number {
    return this.parent.children.indexOf(this);
  }

  getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getMyIndex().toString()}`;
  }

  insertText(
    text: string,
    offset: number,
    formatings?: RichTextManager,
  ): [ArenaNodeCore, number] | undefined {
    const result = super.insertText(text, offset, formatings);
    if (result) {
      return result;
    }
    return this.parent.insertText(text, this.getMyIndex() + 1, formatings);
  }

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNodeCore, ArenaNodeCore, number,
  ] | undefined {
    const result = super.createAndInsertNode(arena, offset);
    if (result) {
      return result;
    }
    return this.parent.createAndInsertNode(arena, this.getMyIndex() + 1);
  }
}
