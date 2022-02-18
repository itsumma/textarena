import { ArenaKeyboardEvent } from '../interfaces';

export class BrowserCommandEvent implements ArenaKeyboardEvent {
  static type = 'browserommand';

  constructor(
    public event: KeyboardEvent,
  ) {
  }
}
