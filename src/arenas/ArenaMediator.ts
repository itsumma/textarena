import { ArenaMediatorInterface } from '../interfaces/Arena';
import AbstractAncestorArena from './AbstractAncestorArena';

export default class ArenaMediator
  extends AbstractAncestorArena
  implements ArenaMediatorInterface {
  readonly root: boolean = true;

  readonly hasParent: boolean = false;
}
