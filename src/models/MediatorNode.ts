import ArenaNodeAncestorInterface from 'interfaces/ArenaNodeAncestorInterface';
import Arena, {
  ArenaWithChildText, ArenaWithNodes,
} from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import ArenaNodeScionInterface from 'interfaces/ArenaNodeScionInterface';
import RichTextManager from 'RichTextManager';
import AncestorNodeAbstract from './AncestorNodeAbstract';

// TODO сделать вариант когда у нас фиксированное количество дочерних нод,
// например callout (title, paragraph)
// или quote (title, section).

export default class MediatorNode
  extends AncestorNodeAbstract
  implements ArenaNodeScionInterface {
  constructor(
    arena: ArenaWithNodes | ArenaWithChildText,
    public parent: ArenaNodeAncestorInterface,
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
  ): [ArenaNodeInterface, number] | undefined {
    const result = super.insertText(text, offset, formatings);
    if (result) {
      return result;
    }
    return this.parent.insertText(text, this.getMyIndex() + 1, formatings);
  }

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNodeInterface, ArenaNodeInterface, number,
  ] | undefined {
    const result = super.createAndInsertNode(arena, offset);
    if (result) {
      return result;
    }
    return this.parent.createAndInsertNode(arena, this.getMyIndex() + 1);
  }
}
