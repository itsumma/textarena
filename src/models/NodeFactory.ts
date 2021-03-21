import AnyArena from '../interfaces/arena/AnyArena';
import ArenaNodeAncestor from '../interfaces/ArenaNodeAncestor';
import ArenaNodeScion from '../interfaces/ArenaNodeScion';
import MediatorNode from './MediatorNode';
import RichNode from './RichNode';
import SingleNode from './SingleNode';

export default class NodeFactory {
  static createNode(arena: AnyArena, parent: ArenaNodeAncestor): ArenaNodeScion {
    if ('allowText' in arena) {
      return new RichNode(arena, parent);
    }
    if ('single' in arena) {
      return new SingleNode(arena, parent);
    }
    if ('hasChildren' in arena) {
      return new MediatorNode(arena, parent);
    }
    throw new Error('Cant create Node');
  }
}
