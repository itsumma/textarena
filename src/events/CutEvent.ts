import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';

export default class CutEvent implements ArenaKeyboardEvent {
  static type = 'cut';

  constructor(
    public event: KeyboardEvent,
  ) {
  }
}
