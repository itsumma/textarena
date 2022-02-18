import { ArenaKeyboardEvent } from '../interfaces';

export type Direction = 'backward' | 'forward';

export class RemoveEvent implements ArenaKeyboardEvent {
  static type = 'remove';

  constructor(
    public event: KeyboardEvent,
    public readonly direction: Direction,
  ) {
  }
}
