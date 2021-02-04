import ArenaNodeAncestorInterface from './ArenaNodeAncestorInterface';
import ArenaNodeInterface from './ArenaNodeInterface';

export default interface ArenaNodeScionInterface extends ArenaNodeInterface {
  parent: ArenaNodeAncestorInterface;
}
