import { ArenaKeyboardEvent } from '../interfaces';
import { KeyboardKey } from '../services';

export class CommandEvent implements ArenaKeyboardEvent {
  static type = 'shortcut';

  constructor(
    public event: KeyboardEvent,
    public key: KeyboardKey,
    public modifiersSum: number,
  ) {
  }
}
