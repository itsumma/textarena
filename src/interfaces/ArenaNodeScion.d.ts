import ArenaNodeAncestor from './ArenaNodeAncestor';
import ArenaNodeCore from './ArenaNodeCore';

export default interface ArenaNodeScion extends ArenaNodeCore {
  hasParent: true;

  parent: ArenaNodeAncestor;

  remove(): void

  getIndex(): number;
}
