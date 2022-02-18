import { ArenaMediatorInterface } from '../interfaces/Arena';
import { AbstractAncestorArena } from './AbstractAncestorArena';

export class ArenaMediator
  extends AbstractAncestorArena
  implements ArenaMediatorInterface {
  readonly root: boolean = true;

  readonly hasParent: boolean = false;
}
