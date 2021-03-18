import ArenaInline from '../interfaces/ArenaInline';
import AbstractArena from './AbstractArena';

export default class InlineArena
  extends AbstractArena
  implements ArenaInline {
  readonly inline = true;
}
