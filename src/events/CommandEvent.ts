import { KeyboardKey } from 'ArenaCommandManager';
import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';

export default class CommandEvent implements ArenaKeyboardEvent {
  static type = 'shortcut';

  constructor(
    public event: KeyboardEvent,
    public command: KeyboardKey,
    public modifiersSum: number,
  ) {
  }
}
