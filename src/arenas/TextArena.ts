import { ArenaWithText } from 'interfaces/Arena';
import { ArenaOptionsWithText } from 'interfaces/ArenaOptions';
import AbstractArena from './AbstractArena';

export default class TextArena
  extends AbstractArena
  implements ArenaWithText {
  readonly allowText = true;

  readonly allowFormating: boolean;

  constructor(options: ArenaOptionsWithText) {
    super(options);
    this.allowFormating = options.allowFormating;
  }
}
