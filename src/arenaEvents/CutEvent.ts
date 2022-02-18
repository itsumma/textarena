import { ArenaKeyboardEvent } from '../interfaces';

export class CutEvent implements ArenaKeyboardEvent {
  static type = 'cut';

  constructor(
    public event: KeyboardEvent,
  ) {
  }
}
