import ArenaSingle from '../interfaces/arena/ArenaSingle';
import AbstractArena from './AbstractArena';

export default class SingleArena
  extends AbstractArena
  implements ArenaSingle {
  readonly hasParent: true = true;

  readonly hasChildren: false = false;

  readonly hasText: false = false;

  readonly inline: false = false;

  readonly single: true = true;
}
