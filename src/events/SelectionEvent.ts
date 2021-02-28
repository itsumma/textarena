import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';

export default class SelectionEvent implements ArenaKeyboardEvent {
  static type = 'selection';

  constructor(
    public event: KeyboardEvent,
  ) {
  }
}
