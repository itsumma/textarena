import ArenaSingle from '../interfaces/ArenaSingle';
import AbstractArena from './AbstractArena';

export default class SingleArena
  extends AbstractArena
  implements ArenaSingle {
  readonly single = true;
}
