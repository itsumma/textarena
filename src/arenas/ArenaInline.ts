import { ArenaInlineInterface } from '../interfaces/Arena';
import { AbstractArena } from './AbstractArena';

export class ArenaInline
  extends AbstractArena
  implements ArenaInlineInterface {
  readonly hasParent: false = false;

  readonly hasChildren: false = false;

  readonly hasText: false = false;

  readonly inline: true = true;

  readonly single: false = false;
}
