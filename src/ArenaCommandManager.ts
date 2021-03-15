/* eslint-disable no-bitwise */
import Textarena from 'Textarena';
import ArenaSelection from 'ArenaSelection';

type CommandAction = (textarena: Textarena, selection: ArenaSelection) => ArenaSelection;

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

export type KeyboardKey = typeof keyboardKeys[number];

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

export default class ArenaCommandManager {
  commands: {
    [key: string]: CommandAction,
  } = {};

  shortcuts: {
    [key: string]: string,
  } = {};

  constructor(private ta: Textarena) {
  }

  registerCommand(
    command: string,
    action: CommandAction,
  ): ArenaCommandManager {
    this.commands[command] = action;
    return this;
  }

  registerShortcut(
    shortcut: string,
    command: string,
  ): ArenaCommandManager {
    const [modifiersSum, key] = this.parseShortcut(shortcut);
    const s = `${modifiersSum}+${key}`;
    this.shortcuts[s] = command;
    return this;
  }

  execCommand(command: string, selection?: ArenaSelection): void {
    this.ta.logger.log('exec command', command, selection);
    if (this.commands[command]) {
      if (selection) {
        const newSelection = this.commands[command](this.ta, selection);
        this.ta.eventManager.fire({ name: 'modelChanged', data: newSelection });
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
}
