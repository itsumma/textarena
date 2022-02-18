import { ArenaKeyboardEvent } from '../interfaces';

export class PasteEvent implements ArenaKeyboardEvent {
  static type = 'paste';

  constructor(
    public event: KeyboardEvent,
  ) {
  }
}
