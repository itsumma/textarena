import Arena from 'interfaces/Arena';
import ArenaNodeAncestorInterface from 'interfaces/ArenaNodeAncestorInterface';
import ArenaNodeScionInterface from 'interfaces/ArenaNodeScionInterface';
import MediatorNode from './MediatorNode';
import RichNode from './RichNode';
import TextNode from './TextNode';

export default class NodeFactory {
  static createNode(arena: Arena, parent: ArenaNodeAncestorInterface): ArenaNodeScionInterface {
    if ('allowFormating' in arena) {
      return new RichNode(arena, parent);
    }
    if ('allowText' in arena) {
      return new TextNode(arena, parent);
    }
    return new MediatorNode(arena, parent);
  }
}
