import ArenaKeyboardEvent from '../interfaces/ArenaKeyboardEvent';

export default class CopyEvent implements ArenaKeyboardEvent {
  static type = 'copy';

  constructor(
    public event: KeyboardEvent,
  ) {
  }
}
