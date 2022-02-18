import { ArenaKeyboardEvent } from '../interfaces';

export class ArenaInputEvent implements ArenaKeyboardEvent {
  static type = 'input';

  constructor(
    public event: KeyboardEvent,
    public character: string,
  ) {
  }
}
