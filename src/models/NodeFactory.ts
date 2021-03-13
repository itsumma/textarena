import Arena from 'interfaces/Arena';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import MediatorNode from './MediatorNode';
import RichNode from './RichNode';
import SingleNode from './SingleNode';

export default class NodeFactory {
  static createNode(arena: Arena, parent: ArenaNodeAncestor): ArenaNodeScion {
    if ('allowText' in arena) {
      return new RichNode(arena, parent);
      // return new TextNode(arena, parent);
    }
    if ('single' in arena) {
      return new SingleNode(arena, parent);
    }
    return new MediatorNode(arena, parent);
  }
}
