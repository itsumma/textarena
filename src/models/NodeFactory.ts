import MediatorNode from './MediatorNode';
import TextNode from './TextNode';
import RootNode from './RootNode';
import SingleNode from './SingleNode';
import {
  ArenaInlineInterface, ArenaRootInterface, ChildArena,
} from '../interfaces/Arena';
import {
  ArenaNodeInline, ArenaNodeRoot, ChildArenaNode,
} from '../interfaces/ArenaNode';
import InlineNode from './InlineNode';
import NodeRegistry from '../helpers/NodeRegistry';

export default class NodeFactory {
  static createRootNode(arena: ArenaRootInterface): ArenaNodeRoot {
    return new RootNode(arena);
  }

  static createChildNode(
    arena: ChildArena,
    registry: NodeRegistry,
  ): ChildArenaNode {
    if (arena.hasChildren) {
      let children;
      if (arena.protected) {
        children = arena.protectedChildren.map(
          (childArena) => this.createChildNode(childArena, registry),
        );
      }
      const id = registry.generateId();
      const node = new MediatorNode(arena, id, children);
      registry.registerNode(id, node);
      return node;
    }
    if (arena.hasText) {
      const id = registry.generateId();
      const node = new TextNode(arena, id);
      registry.registerNode(id, node);
      return node;
    }
    if (arena.single) {
      const id = registry.generateId();
      const node = new SingleNode(arena, id);
      registry.registerNode(id, node);
      return node;
    }
    throw new Error('Cant create Node');
  }

  static createInlineNode(arena: ArenaInlineInterface): ArenaNodeInline {
    return new InlineNode(arena);
  }
}
