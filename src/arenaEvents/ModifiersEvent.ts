import { ArenaKeyboardEvent } from '../interfaces';

export class ModifiersEvent implements ArenaKeyboardEvent {
  static type = 'modifiers';

  constructor(
    public event: KeyboardEvent,
    public sum: number,
  ) {
  }
}
