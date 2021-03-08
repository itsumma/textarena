import { ArenaRoot } from 'interfaces/Arena';
import AncestorArena from './AncestorArena';

export default class RootArena
  extends AncestorArena
  implements ArenaRoot {
  readonly root = true;
}
