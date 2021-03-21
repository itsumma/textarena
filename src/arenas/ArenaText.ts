import { ArenaOptionsWithText } from '../interfaces/ArenaOptions';
import ArenaMiddleware from '../interfaces/ArenaMiddleware';

import AbstractArena from './AbstractArena';
import { ArenaMediatorInterface, ArenaTextInterface } from '../interfaces/Arena';

export default class ArenaText
  extends AbstractArena
  implements ArenaTextInterface {
  readonly hasParent: true = true;

  readonly hasChildren: false = false;

  readonly hasText: true = true;

  readonly inline: false = false;

  readonly single: false = false;

  readonly nextArena: ArenaTextInterface | ArenaMediatorInterface | undefined;

  middlewares: ArenaMiddleware[] = [];

  constructor(options: ArenaOptionsWithText) {
    super(options);
    this.nextArena = options.nextArena;
  }

  registerMiddleware(middleware: ArenaMiddleware): void {
    this.middlewares.push(middleware);
  }
}
