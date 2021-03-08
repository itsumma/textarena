import ArenaNodeAncestor from './ArenaNodeAncestor';
import ArenaNodeCore from './ArenaNodeCore';

export default interface ArenaNodeScion extends ArenaNodeCore {
  readonly hasParent: true;

  readonly parent: ArenaNodeAncestor | (ArenaNodeAncestor & ArenaNodeScion);

  remove(): void

  getIndex(): number;
}
