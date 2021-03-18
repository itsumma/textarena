import ArenaKeyboardEvent from '../interfaces/ArenaKeyboardEvent';

export default class InputEvent implements ArenaKeyboardEvent {
  static type = 'input';

  constructor(
    public event: KeyboardEvent,
    public character: string,
  ) {
  }
}
