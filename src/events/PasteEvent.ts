import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';

export default class PasteEvent implements ArenaKeyboardEvent {
  static type = 'paste';

  constructor(
    public event: KeyboardEvent,
  ) {
  }
}
