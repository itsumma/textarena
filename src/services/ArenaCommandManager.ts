/* eslint-disable no-bitwise */
import ArenaSelection from '../helpers/ArenaSelection';
import CommandAction from '../interfaces/CommandAction';
import ArenaServiceManager from './ArenaServiceManager';

export const keyboardKeys = [
  'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Insert', 'Delete',

  'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5',
  'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace',

  'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU',
  'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash',

  'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ',
  'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter',

  'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM',
  'Comma', 'Period', 'Slash',

  'Space',

  'NumpadDivide', 'NumpadMultiply', 'NumpadSubtract',
  'Numpad7', 'Numpad8', 'Numpad9', 'NumpadAdd',
  'Numpad4', 'Numpad5', 'Numpad6',
  'Numpad1', 'Numpad2', 'Numpad3',
  'Numpad0', 'NumpadDecimal', 'NumpadEnter',

  'ArrowUp',
  'ArrowLeft', 'ArrowDown', 'ArrowRight',
];

const keyboardReplases: Record<string, string> = {
  backquote: '`',
  minus: '−',
  equal: '=',
  bracketleft: '[',
  bracketright: ']',
  backslash: '\\',
  semicolon: ':',
  quote: '\'',
  comma: ',',
  period: '.',
  slash: '/',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
};

export type KeyboardKey = typeof keyboardKeys[number];

export type ShortcutsHelp = Array<{
  shortcut: string,
  description: string,
}>;

export const Modifiers = {
  Shift: 1,
  Ctrl: 2,
  Alt: 4,
  Meta: 8,
};

export type Modifiers = {
  Shift: boolean,
  Ctrl: boolean,
  Alt: boolean,
  Meta: boolean,
};

type Commands = {
  [key: string]: {
    action: CommandAction,
    saveToHistory: boolean,
  }
};

export default class ArenaCommandManager {
  commands: Commands = {};

  shortcuts: {
    [key: string]: string,
  } = {};

  help: ShortcutsHelp = [];

  constructor(protected asm: ArenaServiceManager) {
  }

  registerCommand(
    command: string,
    action: CommandAction,
    saveToHistory = true,
  ): ArenaCommandManager {
    this.commands[command] = {
      action,
      saveToHistory,
    };
    return this;
  }

  registerShortcut(
    shortcut: string,
    command: string,
    description?: string,
  ): ArenaCommandManager {
    const [modifiersSum, key] = this.parseShortcut(shortcut);
    const s = `${modifiersSum}+${key}`;
    this.shortcuts[s] = command;
    if (description) {
      this.help.push({
        shortcut: this.getHumanShortcut(shortcut),
        description,
      });
    }
    return this;
  }

  execCommand(
    command: string,
    selection?: ArenaSelection,
  ): void {
    this.asm.logger.log('exec command', command, selection);
    if (this.commands[command]) {
      if (selection) {
        const { action, saveToHistory } = this.commands[command];
        const newSelection = action(this.asm.textarena, selection);
        if (saveToHistory) {
          this.asm.history.save(newSelection);
        }
        this.asm.eventManager.fire('modelChanged', { selection: newSelection });
      }
    }
  }

  execShortcut(
    selection: ArenaSelection,
    modifiersSum: number,
    key: KeyboardKey,
  ): void {
    const shortcut = `${modifiersSum}+${key}`;
    if (this.shortcuts[shortcut]) {
      this.execCommand(this.shortcuts[shortcut], selection);
    }
  }

  getModifiersSum(modifiers: Modifiers): number {
    return (modifiers.Shift ? Modifiers.Shift : 0)
      | (modifiers.Ctrl ? Modifiers.Ctrl : 0)
      | (modifiers.Alt ? Modifiers.Alt : 0)
      | (modifiers.Meta ? Modifiers.Meta : 0);
  }

  parseShortcut(shortcut: string): [number, string | undefined] {
    const keys = shortcut.split('+');
    let sum = 0;
    let lastKey: string | undefined;
    keys.forEach((key) => {
      if (key.trim().toLowerCase() === 'shift') {
        sum += Modifiers.Shift;
      } else if (['ctrl', 'control'].includes(key.trim().toLowerCase())) {
        sum += Modifiers.Ctrl;
      } else if (key.trim().toLowerCase() === 'alt') {
        sum += Modifiers.Alt;
      } else if (['meta', 'win', 'windows'].includes(key.trim().toLowerCase())) {
        sum += Modifiers.Meta;
      } else {
        lastKey = key.trim();
      }
    });
    if (lastKey && keyboardKeys.includes(lastKey)) {
      return [sum, lastKey];
    }
    throw new Error(`Can not parse shortcut ${shortcut}`);
  }

  getHumanShortcut(shortcut: string): string {
    const keys = shortcut.split('+');
    const result: string[] = [];
    keys.forEach((key) => {
      const lowerKey = key.toLowerCase().trim();
      if (lowerKey in keyboardReplases) {
        result.push(keyboardReplases[lowerKey]);
      } else if (lowerKey.substr(0, 3) === 'key') {
        result.push(lowerKey.substr(3, 1).toUpperCase());
      } else if (lowerKey.substr(0, 5) === 'digit') {
        result.push(lowerKey.substr(5, 1).toUpperCase());
      } else {
        result.push(key.trim());
      }
    });
    return result.join(' + ');
  }

  getHelp(): ShortcutsHelp {
    return this.help;
  }
}
