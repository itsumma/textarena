import { ArenaOptionsWithText, TextProcessor } from '../interfaces/ArenaOptions';

import AbstractArena from './AbstractArena';
import { ArenaMediatorInterface, ArenaTextInterface } from '../interfaces/Arena';
import { ArenaNodeText } from '../interfaces/ArenaNode';

export default class ArenaText
  extends AbstractArena
  implements ArenaTextInterface {
  readonly hasParent: true = true;

  readonly hasChildren: false = false;

  readonly hasText: true = true;

  readonly inline: false = false;

  readonly single: false = false;

  readonly nextArena: ArenaTextInterface | ArenaMediatorInterface | undefined;

  protected getPlainProcessor: TextProcessor | undefined;

  constructor(options: ArenaOptionsWithText) {
    super(options);
    this.nextArena = options.nextArena;
    this.getPlainProcessor = options.getPlain;
  }

  getPlain(text: string, node: ArenaNodeText): string {
    if (this.getPlainProcessor) {
      return this.getPlainProcessor(text, node);
    }
    return text;
  }
}
