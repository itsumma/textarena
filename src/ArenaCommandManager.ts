import Textarena from 'Textarena';
import ArenaSelection from 'ArenaSelection';
import CommandEvent from 'events/CommandEvent';

type CommandAction = (textarena: Textarena, selection: ArenaSelection) => ArenaSelection;

export default class ArenaCommandManager {
  commands: {
    [key: string]: CommandAction
  } = {};

  constructor(private textarena: Textarena) {
  }

  exec(selection: ArenaSelection, event: CommandEvent): ArenaSelection {
    this.textarena.logger.log('exec', event, selection);
    const { command, modifiers } = event;
    const method = `exec${command.charAt(0).toUpperCase()}${command.slice(1)}`;
    if (method in this) {
      return this[method](selection);
    }
    const commandStr = [...modifiers, command].join(' + ');
    console.log('cmd', commandStr, this.commands);
    if (this.commands[commandStr]) {
      return this.commands[commandStr](this.textarena, selection);
    }
    return selection;
  }

  execEnter(selection: ArenaSelection): ArenaSelection {
    return this.textarena.model.breakSelection(selection);
  }

  registerCommand(
    command: string,
    action: CommandAction,
  ): ArenaCommandManager {
    this.commands[command] = action;
    return this;
  }
}
