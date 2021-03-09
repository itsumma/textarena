import { ArenaWithText } from 'interfaces/Arena';
import { ArenaOptionsWithText } from 'interfaces/ArenaOptions';
import AbstractArena from './AbstractArena';

export default class TextArena
  extends AbstractArena
  implements ArenaWithText {
  readonly allowText = true;

  readonly nextArena: ArenaWithText;

  readonly allowFormating: boolean;

  constructor(options: ArenaOptionsWithText) {
    super(options);
    console.log(options);
    this.allowFormating = options.allowFormating;
    this.nextArena = options.nextArena;
  }
}
