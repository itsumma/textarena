import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';

type SpecialCommand = 'escape' | 'tab' | 'enter' | 'scrolllock' | 'capslock' | 'numlock' | 'pause' | 'break' | 'insert' | 'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6' | 'f7' | 'f8' | 'f9' | 'f10' | 'f11' | 'f12';

export default class SpecialEvent implements ArenaKeyboardEvent {
  static type = 'special';

  constructor(
    public event: KeyboardEvent,
    public command: SpecialCommand,
  ) {
  }
}
