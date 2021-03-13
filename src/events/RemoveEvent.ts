import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';

export type Direction = 'backward' | 'forward';

export default class RemoveEvent implements ArenaKeyboardEvent {
  static type = 'remove';

  constructor(
    public event: KeyboardEvent,
    public readonly direction: Direction,
  ) {
  }
}
