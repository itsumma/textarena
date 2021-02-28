import InputEvent from 'events/InputEvent';
import RemoveEvent from 'events/RemoveEvent';
import SelectionEvent from 'events/SelectionEvent';
import ShortCutEvent from 'events/ShortCutEvent';
import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';
import Textarena from 'Textarena';

const modifiersKeys = {
  shift: 16,
  ctrl: 17,
  alt: 18,
  meta: 91,
};

const selectionKeys = {
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36,

  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

const typeKeys = {
  space: 32,
};

const removeKeys = {
  backspace: 8,
  delete: 46,
};

const specialKeys = {
  escape: 27,
  tab: 9,
  return: 13,
  enter: 13,

  scrolllock: 145,
  capslock: 20,
  numlock: 144,

  pause: 19,
  break: 19,

  insert: 45,

  f1: 112,
  f2: 113,
  f3: 114,
  f4: 115,
  f5: 116,
  f6: 117,
  f7: 118,
  f8: 119,
  f9: 120,
  f10: 121,
  f11: 122,
  f12: 123,
};

function invertObject<
  T extends Record<string | number, string | number>
>(obj: T): { [key in T[keyof T]]: keyof T } {
  const result = Object.entries(obj)
    .reduce((prev, [key, value]) => ({ ...prev, [value]: key }), { });
  return result as { [key in T[keyof T]]: keyof T };
}

const modifiersCodes = invertObject(modifiersKeys);

const selectionCodes = invertObject(selectionKeys);

const typeCodes = invertObject(typeKeys);

const removeCodes = invertObject(removeKeys);

const specialCodes = invertObject(specialKeys);

export default class ArenaBrowser {
  inputListenerInstance: ((e: Event) => void);

  beforeinputListenerInstance: ((e: Event) => void);

  mouseUpListenerInstance: (() => void);

  keyUpListenerInstance: ((e: KeyboardEvent) => void);

  keyPressListenerInstance: ((e: KeyboardEvent) => void);

  keyDownListenerInstance: ((e: KeyboardEvent) => void);

  selectListenerInstance: (() => void);

  pasteListenerInstance: ((event: ClipboardEvent) => void);

  constructor(
    private textarena: Textarena,
  ) {
    this.inputListenerInstance = this.inputListener.bind(this);
    this.beforeinputListenerInstance = this.beforeinputListener.bind(this);
    this.mouseUpListenerInstance = this.mouseUpListener.bind(this);
    this.keyUpListenerInstance = this.keyUpListener.bind(this);
    this.keyPressListenerInstance = this.keyPressListener.bind(this);
    this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.selectListenerInstance = this.selectListener.bind(this);
    this.pasteListenerInstance = this.pasteListener.bind(this);
    this.textarena.eventManager.subscribe('turnOn', () => {
      this.textarena.editor.addEventListener('input', this.inputListenerInstance, false);
      this.textarena.editor.addEventListener('beforeinput', this.beforeinputListenerInstance, false);
      this.textarena.editor.addEventListener('mouseup', this.mouseUpListenerInstance, false);
      this.textarena.editor.addEventListener('keyup', this.keyUpListenerInstance, false);
      this.textarena.editor.addEventListener('keypress', this.keyPressListenerInstance, false);
      this.textarena.editor.addEventListener('keydown', this.keyDownListenerInstance, false);
      this.textarena.editor.addEventListener('paste', this.pasteListenerInstance, false);
      document.addEventListener('selectionchange', this.selectListenerInstance, false);
    });
    this.textarena.eventManager.subscribe('turnOff', () => {
      this.textarena.editor.removeEventListener('input', this.inputListenerInstance);
      this.textarena.editor.removeEventListener('beforeinput', this.beforeinputListenerInstance);
      this.textarena.editor.removeEventListener('mouseup', this.mouseUpListenerInstance);
      this.textarena.editor.removeEventListener('keyup', this.keyUpListenerInstance);
      this.textarena.editor.removeEventListener('keypress', this.keyPressListenerInstance);
      this.textarena.editor.removeEventListener('keydown', this.keyDownListenerInstance);
      this.textarena.editor.removeEventListener('paste', this.pasteListenerInstance);
      document.removeEventListener('selectionchange', this.selectListenerInstance);
      // this.textarena.editor.stopObserve();
    });
  }

  inputListener(e: Event): void {
    // this.textarena.logger.info('input', e);
    // e.preventDefault();
    // e.stopPropagation();
  }

  beforeinputListener(e: Event): void {
    // this.textarena.logger.info('beforeinput', e);
    // if (e.inputType === 'formatBold') {
    //   e.preventDefault();
    //   e.stopPropagation();
    // }
  }

  mouseUpListener(): void {
    // this.textarena.logger.info('mouseUp');
  }

  checkEvent(prefix: string, e: KeyboardEvent): ArenaKeyboardEvent | undefined {
    const modifiers = {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey,
    };
    const code = e.keyCode || e.which;
    const character = code ? String.fromCharCode(code).toLowerCase() : undefined;
    if (modifiersCodes[code]) {
      this.textarena.logger.info(`${prefix} modifier: ${modifiersCodes[code]}`);
      return undefined;
    }
    if (specialCodes[code]) {
      this.textarena.logger.info(`${prefix} specialCode: ${specialCodes[code]}`);
      // TODO special code
      return undefined;
    }
    if (selectionCodes[code]) {
      this.textarena.logger.info(`${prefix} selectionCode: ${selectionCodes[code]}`);
      return new SelectionEvent(e);
    }
    if (removeCodes[code]) {
      this.textarena.logger.info(`${prefix} removeCode: ${removeCodes[code]}`);
      return new RemoveEvent(
        e,
        removeCodes[code] === 'delete' ? 'forward' : 'backward',
      );
    }
    if (modifiers.alt || modifiers.ctrl || modifiers.meta) {
      const mod = Object.entries(modifiers).filter(([, t]) => t).map(([m]) => m);
      this.textarena.logger.info(`${prefix} modifier ${mod.join(', ')} + ${character}`, code, e);
      // TODO modifier + character
      if (character) {
        return new ShortCutEvent(e, mod, character);
      }
      return undefined;
    }
    this.textarena.logger.info(`${prefix} input: ${character}`, code, e);
    // TODO observe changes
    if (character) {
      return new InputEvent(e, character);
    }
    return undefined;
  }

  keyUpListener(e: KeyboardEvent): void {
    //
  }

  keyPressListener(e: KeyboardEvent): void {
    // this.textarena.logger.info('keyPress', e);
    // e.preventDefault();
    // e.stopPropagation();
  }

  keyDownListener(e: KeyboardEvent): void {
    const event = this.checkEvent('keyDown', e);
    if (event instanceof SelectionEvent) {
      // allow
      return;
    }
    e.cancelBubble = true;
    e.returnValue = false;
    e.stopPropagation();
    e.preventDefault();
    if (!event) {
      return;
    }
    if (event instanceof ShortCutEvent) {
      // TODO shortcut
      return;
    }
    const selection = this.textarena.view.getArenaSelection();
    if (!selection) {
      return;
    }
    if (event instanceof InputEvent) {
      const newSelection = this.textarena.model.insertText(selection, event.character);
      this.textarena.view.render(newSelection);
    }
    if (event instanceof RemoveEvent) {
      const newSelection = this.textarena.model.removeSelection(selection, event.direction);
      this.textarena.view.render(newSelection);
    }
  }

  pasteListener(e: ClipboardEvent): void {
    e.preventDefault();
    this.textarena.logger.info('pasteListener', e);
    const s = window.getSelection();
    const isCollapsed = s && s.isCollapsed;
    if (!isCollapsed) {
      // TODO remove selection
    }
    // TODO paste
  }

  selectListener(): void {
    // this.textarena.logger.info('select');
  }
}
