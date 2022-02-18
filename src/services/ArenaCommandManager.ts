/* eslint-disable no-bitwise */
import { ArenaSelection } from '../helpers';
import { CommandAction } from '../interfaces';
import { isMac } from '../utils/navigator';
import { ArenaServiceManager } from './ArenaServiceManager';

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

export const lowerKeyboardKeys = keyboardKeys.map((key) => key.toLowerCase());

const keyboardReplaces: Record<string, string> = {
  backquote: '`',
  digit1: '1',
  digit2: '2',
  digit3: '3',
  digit4: '4',
  digit5: '5',
  digit6: '6',
  digit7: '7',
  digit8: '8',
  digit9: '9',
  digit0: '0',
  minus: '−',
  equal: '=',
  keyq: 'q',
  keyw: 'w',
  keye: 'e',
  keyr: 'r',
  keyt: 't',
  keyy: 'y',
  keyu: 'u',
  keyi: 'i',
  keyo: 'o',
  keyp: 'p',
  bracketleft: '[',
  bracketright: ']',
  backslash: '\\',
  keya: 'a',
  keys: 's',
  keyd: 'd',
  keyf: 'f',
  keyg: 'g',
  keyh: 'h',
  keyj: 'j',
  keyk: 'k',
  keyl: 'l',
  semicolon: ':',
  quote: '"',
  keyz: 'z',
  keyx: 'x',
  keyc: 'c',
  keyv: 'v',
  keyb: 'b',
  keyn: 'n',
  keym: 'm',
  comma: ',',
  period: '.',
  slash: '/',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
};

const keyboardRreplacesReverse = Object.entries(keyboardReplaces).reduce((ret, [key, value]) => {
  // eslint-disable-next-line no-param-reassign
  ret[value] = key;
  return ret;
}, {} as { [key: string]: string });

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
  [name: string]: {
    action: CommandAction,
    saveToHistory: boolean,
    fireChanges: boolean,
  }
};

type ShortcutOptions = { command: string };

type Shortcuts = {
  [key: string]: ShortcutOptions[],
};

export class ArenaCommandManager {
  commands: Commands = {};

  shortcuts: Shortcuts = {};

  help: ShortcutsHelp = [];

  constructor(protected asm: ArenaServiceManager) {
  }

  registerCommand(
    command: string,
    action: CommandAction,
    saveToHistory = true,
    fireChanges = true,
  ): ArenaCommandManager {
    this.commands[command] = {
      action,
      saveToHistory,
      fireChanges,
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
    if (!this.shortcuts[s]) {
      this.shortcuts[s] = [];
    }
    this.shortcuts[s].push({ command });
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
  ): ArenaSelection | undefined {
    this.asm.logger.log('exec command', command, selection);
    if (this.commands[command]) {
      if (selection) {
        const { action, saveToHistory, fireChanges } = this.commands[command];
        const result = action(this.asm.textarena, selection);
        const handleNewSelection = (newSelection: ArenaSelection): ArenaSelection => {
          if (saveToHistory) {
            this.asm.history.save(newSelection);
          }
          if (fireChanges) {
            this.asm.eventManager.fire('modelChanged', { selection: newSelection });
          }
          return newSelection;
        };
        if (result instanceof Promise) {
          result.then(handleNewSelection).catch((e) => this.asm.logger.error(e));
          return undefined;
        }
        if (typeof result !== 'boolean') {
          return handleNewSelection(result);
        }
      }
    }
    return selection;
  }

  execShortcut(
    selection: ArenaSelection,
    modifiersSum: number,
    key: KeyboardKey,
  ): void {
    const shortcut = `${modifiersSum}+${key}`;
    if (this.shortcuts[shortcut]) {
      const options = this.shortcuts[shortcut];
      let sel: ArenaSelection | undefined = selection;
      for (let i = 0; i < options.length; i += 1) {
        sel = this.execCommand(options[i].command, sel);
      }
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
      const lower = key.trim().toLowerCase();
      if (lower === 'shift') {
        sum += Modifiers.Shift;
      } else if (['ctrl', 'control'].includes(lower)) {
        sum += Modifiers.Ctrl;
      } else if (lower === 'alt') {
        sum += Modifiers.Alt;
      } else if (['meta', 'win', 'windows'].includes(lower)) {
        sum += Modifiers.Meta;
      } else {
        lastKey = lower;
      }
    });

    if (lastKey) {
      if (lowerKeyboardKeys.includes(lastKey)) {
        return [sum, lastKey];
      }

      if (keyboardRreplacesReverse[lastKey]) {
        return [sum, keyboardRreplacesReverse[lastKey]];
      }
    }

    throw new Error(`Can not parse shortcut ${shortcut}`);
  }

  getHumanShortcut(shortcut: string): string {
    const keys = shortcut.split('+');
    const result: string[] = [];
    keys.forEach((key) => {
      const lowerKey = key.toLowerCase().trim();
      if (lowerKey === 'shift') {
        result.push(isMac() ? '⇧' : 'Shift');
      } else if (['ctrl', 'control'].includes(lowerKey)) {
        result.push(isMac() ? '⌘' : 'Ctrl');
      } else if (lowerKey === 'alt') {
        result.push(isMac() ? '⌥' : 'Alt');
      } else if (['meta', 'win', 'windows'].includes(lowerKey)) {
        result.push(isMac() ? '⌃' : 'Win');
      } else if (lowerKey in keyboardReplaces) {
        result.push(keyboardReplaces[lowerKey].toUpperCase());
      } else {
        result.push(key.trim());
      }
    });
    return result.join(' + ');
  }

  getHumanKey(key: string): string {
    const lowerKey = key.toLowerCase().trim();
    if (lowerKey in keyboardReplaces) {
      return keyboardReplaces[lowerKey].toUpperCase();
    }
    return '';
  }

  getHelp(): ShortcutsHelp {
    return this.help;
  }
}
