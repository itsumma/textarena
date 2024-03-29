import { NodeRegistry } from '../helpers';
import {
  ArenaInlineInterface, ArenaNodeInline, ArenaNodeRoot, ArenaRootInterface, ChildArena,
  ChildArenaNode, NodeAttributes,
} from '../interfaces';
import { InlineNode } from './InlineNode';
import { MediatorNode } from './MediatorNode';
import { RootNode } from './RootNode';
import { SingleNode } from './SingleNode';
import { TextNode } from './TextNode';

export class NodeFactory {
  static createRootNode(arena: ArenaRootInterface): ArenaNodeRoot {
    return new RootNode(arena);
  }

  static createChildNode(
    arena: ChildArena,
    registry: NodeRegistry,
    isNew?: boolean,
    content?: string,
  ): ChildArenaNode {
    if (arena.hasChildren) {
      let children = [];
      if (arena.protected) {
        children = arena.protectedChildren.map((item) => {
          let childArena;
          let attributes: NodeAttributes = {};
          let childContent: string | undefined;
          if (Array.isArray(item)) {
            [childArena, attributes, childContent] = item;
          } else {
            childArena = item;
          }
          const node = this.createChildNode(childArena, registry, isNew, childContent);
          node.setAttributes(attributes);
          return node;
        });
      } else if (isNew && arena.arenaForText) {
        const node = this.createChildNode(arena.arenaForText, registry, isNew, content);
        children.push(node);
      }
      const id = registry.generateId();
      const node = new MediatorNode(arena, id, children);
      registry.set(id, node);
      return node;
    }
    if (arena.hasText) {
      const id = registry.generateId();
      const node = new TextNode(arena, id, {}, isNew ? content : undefined);
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

  static createInlineNode(
    arena: ArenaInlineInterface,
  ): ArenaNodeInline {
    return new InlineNode(arena);
  }
}
