import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';
import { KeyboardKey } from 'services/ArenaCommandManager';

export default class CommandEvent implements ArenaKeyboardEvent {
  static type = 'shortcut';

  constructor(
    public event: KeyboardEvent,
    public command: KeyboardKey,
    public modifiersSum: number,
  ) {
  }
}
