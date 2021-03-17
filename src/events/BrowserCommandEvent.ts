import ArenaKeyboardEvent from '../interfaces/ArenaKeyboardEvent';

export default class BrowserCommandEvent implements ArenaKeyboardEvent {
  static type = 'browserommand';

  constructor(
    public event: KeyboardEvent,
  ) {
  }
}
