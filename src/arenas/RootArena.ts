import ArenaRoot from '../interfaces/arena/ArenaRoot';
import AncestorArena from './AncestorArena';

export default class RootArena
  extends AncestorArena
  implements ArenaRoot {
  readonly root = true;

  readonly hasParent: false = false;
}
