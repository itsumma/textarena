// import AncestorNodeAbstract from './AncestorNodeAbstract';
import Arena from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import NodeFactory from './NodeFactory';
import AncestorNodeAbstract from './AncestorNodeAbstract';

// У корневого может быть разрешены либо параграфы (заголовки), либо секции (и большие картинки)

export default class RootNode extends AncestorNodeAbstract {
  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNodeInterface, ArenaNodeInterface, number,
  ] | undefined {
    if (this.arena.allowedArenas.includes(arena)) {
      const node = NodeFactory.createNode(arena, this);
      this.children.splice(offset, 0, node);
      return [node, this, offset + 1];
    }
    return undefined;
  }
}
