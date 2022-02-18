import { ArenaKeyboardEvent } from '../interfaces';

export class CopyEvent implements ArenaKeyboardEvent {
  static type = 'copy';

  constructor(
    public event: KeyboardEvent,
  ) {
  }
}
