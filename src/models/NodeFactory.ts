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
import ArenaAttributes from '../interfaces/ArenaAttributes';

export default class NodeFactory {
  static createRootNode(arena: ArenaRootInterface): ArenaNodeRoot {
    return new RootNode(arena);
  }

  static createChildNode(
    arena: ChildArena,
    registry: NodeRegistry,
    isNew = false,
  ): ChildArenaNode {
    if (arena.hasChildren) {
      let children;
      if (arena.protected) {
        children = arena.protectedChildren.map((item) => {
          let childArena;
          let attributes: ArenaAttributes = {};
          let content: string | undefined;
          if (Array.isArray(item)) {
            [childArena, attributes, content] = item;
          } else {
            childArena = item;
          }
          const node = this.createChildNode(childArena, registry);
          node.setAttributes(attributes);
          if (isNew && node.hasText && content) {
            node.insertText(content, 0);
          }
          return node;
        });
      }
      const id = registry.generateId();
      const node = new MediatorNode(arena, id, children);
      registry.set(id, node);
      return node;
    }
    if (arena.hasText) {
      const id = registry.generateId();
      const node = new TextNode(arena, id);
      registry.set(id, node);
      return node;
    }
    if (arena.single) {
      const id = registry.generateId();
      const node = new SingleNode(arena, id);
      registry.set(id, node);
      return node;
    }
    throw new Error('Cant create Node');
  }

  static createInlineNode(arena: ArenaInlineInterface): ArenaNodeInline {
    return new InlineNode(arena);
  }
}
