import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';

export default class ModifiersEvent implements ArenaKeyboardEvent {
  static type = 'modifiers';

  constructor(
    public event: KeyboardEvent,
    public sum: number,
  ) {
  }
}
