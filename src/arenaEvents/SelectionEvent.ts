import { ArenaKeyboardEvent } from '../interfaces';

export class SelectionEvent implements ArenaKeyboardEvent {
  static type = 'selection';

  constructor(
    public event: KeyboardEvent,
  ) {
  }
}
