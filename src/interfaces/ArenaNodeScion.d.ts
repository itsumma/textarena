import ArenaNodeAncestor from './ArenaNodeAncestor';
import ArenaNodeCore from './ArenaNodeCore';

export default interface ArenaNodeScion extends ArenaNodeCore {
  hasParent: true;

  parent: ArenaNodeAncestor | (ArenaNodeAncestor & ArenaNodeScion);

  remove(): void

  getIndex(): number;
}