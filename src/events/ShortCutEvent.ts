import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';

export default class ShortCutEvent implements ArenaKeyboardEvent {
  static type = 'shortcut';

  constructor(
    public event: KeyboardEvent,
    public modifiers: string[],
    public character: string,
  ) {
  }
}
