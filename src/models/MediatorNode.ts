import ArenaNodeAncestorInterface from 'interfaces/ArenaNodeAncestorInterface';
import Arena, {
  ArenaWithChildText, ArenaWithNodes,
} from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import ArenaNodeScionInterface from 'interfaces/ArenaNodeScionInterface';
import NodeFactory from './NodeFactory';

// TODO сделать вариант когда у нас фиксированное количество дочерних нод,
// например callout (title, paragraph)
// или quote (title, section).

export default class MediatorNode implements ArenaNodeAncestorInterface, ArenaNodeScionInterface {
  children: ArenaNodeScionInterface[] = [];

  constructor(
    public arena: ArenaWithNodes | ArenaWithChildText,
    public parent: ArenaNodeAncestorInterface,
  ) {
  }

  getMyIndex(): number {
    return this.parent.children.indexOf(this);
  }

  insertText(text: string, offset = 0): [ArenaNodeInterface, number] {
    if ('arenaForText' in this.arena) {
      const [newNode] = this.createAndInsertNode(this.arena.arenaForText, offset);
      if (newNode) {
        newNode.insertText(text, 0);
        return [newNode, text.length];
      }
    }
    return this.parent.insertText(text, this.getMyIndex() + 1);
  }

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNodeInterface | undefined, ArenaNodeInterface, number,
  ] {
    if (this.arena.allowedArenas.includes(arena)) {
      const node = NodeFactory.createNode(arena, this);
      this.children.splice(offset, 0, node);
      return [node, this, offset + 1];
    }
    return this.parent.createAndInsertNode(arena, this.getMyIndex() + 1);
  }
}
