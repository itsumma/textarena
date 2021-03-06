import Textarena from 'Textarena';
import ArenaSelection from 'ArenaSelection';
import CommandEvent from 'events/CommandEvent';

type CommandAction = (textarena: Textarena, selection: ArenaSelection) => ArenaSelection;

export default class ArenaCommandManager {
  commands: {
    [key: string]: CommandAction,
  } = {};

  shortcuts: {
    [key: string]: string,
  } = {};

  constructor(private textarena: Textarena) {
  }

  registerCommand(
    command: string,
    action: CommandAction,
  ): ArenaCommandManager {
    this.commands[command] = action;
    return this;
  }

  registerShortcut(
    shortcuts: string,
    command: string,
  ): ArenaCommandManager {
    this.shortcuts[shortcuts] = command;
    return this;
  }

  execCommand(command: string, selection?: ArenaSelection): ArenaSelection | undefined {
    this.textarena.logger.log('exec command', command, selection);
    if (this.commands[command]) {
      const sel = selection || this.textarena.view.getArenaSelection();
      if (sel) {
        return this.commands[command](this.textarena, sel);
      }
    }
    return selection;
  }

  execShortcut(selection: ArenaSelection, shortcut: string): ArenaSelection | undefined {
    if (this.shortcuts[shortcut]) {
      return this.execCommand(this.shortcuts[shortcut], selection);
    }
    return selection;
  }
}
