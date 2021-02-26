import Arena from 'interfaces/Arena';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import MediatorNode from './MediatorNode';
import RichNode from './RichNode';
import TextNode from './TextNode';

export default class NodeFactory {
  static createNode(arena: Arena, parent: ArenaNodeAncestor): ArenaNodeScion {
    if ('allowFormating' in arena) {
      return new RichNode(arena, parent);
    }
    if ('allowText' in arena) {
      return new TextNode(arena, parent);
    }
    return new MediatorNode(arena, parent);
  }
}
