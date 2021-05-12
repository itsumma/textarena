import { ArenaRootInterface } from '../interfaces/Arena';
import AbstractAncestorArena from './AbstractAncestorArena';

export default class ArenaRoot
  extends AbstractAncestorArena
  implements ArenaRootInterface {
  readonly root: true = true;

  readonly hasParent: false = false;
}
