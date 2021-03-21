import ArenaInline from '../interfaces/arena/ArenaInline';
import AbstractArena from './AbstractArena';

export default class InlineArena
  extends AbstractArena
  implements ArenaInline {
  readonly hasParent: false = false;

  readonly hasChildren: false = false;

  readonly hasText: false = false;

  readonly inline: true = true;

  readonly single: false = false;
}
