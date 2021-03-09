import { ArenaSingle } from 'interfaces/Arena';
import AbstractArena from './AbstractArena';

export default class SingleArena
  extends AbstractArena
  implements ArenaSingle {
  readonly single = true;
}
