import SpecialEvent from 'events/SpecialEvent';
import Textarena from 'Textarena';
import ArenaSelection from 'ArenaSelection';

export default class ArenaCommandManager {
  constructor(private textarena: Textarena) {
  }

  exec(selection: ArenaSelection, event: SpecialEvent): ArenaSelection {
    this.textarena.logger.log('exec', event, selection);
    const { command } = event;
    const method = 'exec' + command.charAt(0).toUpperCase() + command.slice(1);
    if (method in this) {
      return this[method](selection);
    }
    return selection;
  }

  execEnter(selection: ArenaSelection): ArenaSelection {
    return this.textarena.model.breakSelection(selection);
  }
}
