import { Middleware } from '../interfaces/Arena';
import ArenaAncestor from '../interfaces/ArenaAncestor';
import { ArenaOptionsWithText } from '../interfaces/ArenaOptions';
import ArenaWithText from '../interfaces/ArenaWithText';
import AbstractArena from './AbstractArena';

export default class TextArena
  extends AbstractArena
  implements ArenaWithText {
  readonly allowText = true;

  readonly nextArena: ArenaWithText | ArenaAncestor | undefined;

  readonly allowFormating: boolean;

  middlewares: Middleware[] = [];

  constructor(options: ArenaOptionsWithText) {
    super(options);
    this.allowFormating = options.allowFormating;
    this.nextArena = options.nextArena;
  }

  registerMiddleware(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }
}
