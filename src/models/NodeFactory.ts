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

export default class NodeFactory {
  static createRootNode(arena: ArenaRootInterface): ArenaNodeRoot {
    return new RootNode(arena);
  }

  static createChildNode(
    arena: ChildArena,
    // parent: ParentArenaNode,
  ): ChildArenaNode {
    if (arena.hasChildren) {
      let children;
      if (arena.protected) {
        children = arena.protectedChildren.map(
          (childArena) => this.createChildNode(childArena),
        );
      }
      return new MediatorNode(arena, children);
    }
    if (arena.hasText) {
      return new TextNode(arena);
    }
    if (arena.single) {
      return new SingleNode(arena);
    }
    throw new Error('Cant create Node');
  }

  static createInlineNode(arena: ArenaInlineInterface): ArenaNodeInline {
    return new InlineNode(arena);
  }
}
