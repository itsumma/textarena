import { ArenaSingleInterface } from '../interfaces/Arena';
import { AbstractArena } from './AbstractArena';

export class ArenaSingle
  extends AbstractArena
  implements ArenaSingleInterface {
  readonly hasParent: true = true;

  readonly hasChildren: false = false;

  readonly hasText: false = false;

  readonly inline: false = false;

  readonly single: true = true;
}
