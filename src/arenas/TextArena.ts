import { ArenaOptionsWithText } from '../interfaces/ArenaOptions';
import ArenaAncestor from '../interfaces/arena/ArenaAncestor';
import ArenaMiddleware from '../interfaces/ArenaMiddleware';
import ArenaWithText from '../interfaces/arena/ArenaWithText';

import AbstractArena from './AbstractArena';

export default class TextArena
  extends AbstractArena
  implements ArenaWithText {
  readonly hasParent: true = true;

  readonly hasChildren: false = false;

  readonly hasText: true = true;

  readonly inline: false = false;

  readonly single: false = false;

  readonly nextArena: ArenaWithText | ArenaAncestor | undefined;

  middlewares: ArenaMiddleware[] = [];

  constructor(options: ArenaOptionsWithText) {
    super(options);
    this.nextArena = options.nextArena;
  }

  registerMiddleware(middleware: ArenaMiddleware): void {
    this.middlewares.push(middleware);
  }
}
