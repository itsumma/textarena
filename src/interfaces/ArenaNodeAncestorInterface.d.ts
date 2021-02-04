import ArenaNodeInterface from './ArenaNodeInterface';
import ArenaNodeScionInterface from './ArenaNodeScionInterface';

export default interface ArenaNodeAncestorInterface extends ArenaNodeInterface {
  children: ArenaNodeScionInterface[];
}
