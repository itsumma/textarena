import ArenaLogger from 'ArenaLogger';
import ElementHelper from 'ElementHelper';
import EventManager from 'EventManager';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
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
  space: 32,
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

  checkEvent(e: KeyboardEvent): 'prevent' | 'input' | 'selection' {
    const modifiers = {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey,
    };
    const code = e.keyCode || e.which;
    const character = code ? String.fromCharCode(code).toLowerCase() : undefined;
    if (modifiersCodes[code]) {
      this.textarena.logger.info(`keyDown modifier: ${modifiersCodes[code]}`);
      // nothing to do
    } else if (specialCodes[code]) {
      this.textarena.logger.info(`keyDown specialCode: ${specialCodes[code]}`);
      // TODO special code
    } else if (selectionCodes[code]) {
      this.textarena.logger.info(`keyDown selectionCode: ${selectionCodes[code]}`);
      // nothing to do
      return 'selection';
    } else if (removeCodes[code]) {
      this.textarena.logger.info(`keyDown removeCode: ${removeCodes[code]}`);
      // TODO custom remove
    } else if (modifiers.alt || modifiers.ctrl || modifiers.meta) {
      const mod = Object.entries(modifiers).filter(([, t]) => t).map(([m]) => m).join(', ');
      this.textarena.logger.info(`keyDown modifier ${mod} + ${character}`, code, e);
      // TODO modifier + character
    } else {
      this.textarena.logger.info(`keyDown true: ${character}`, code, e);

      // TODO observe changes
      return 'input';
    }
    return 'prevent';
  }

  keyUpListener(e: KeyboardEvent): void {
    const result = this.checkEvent(e);
    if (result === 'input') {
      const s = window.getSelection();
      const range = s ? s.getRangeAt(0) : undefined;
      const isCollapsed = s && s.isCollapsed;
      this.textarena.logger.log('oserve', e, isCollapsed, range?.startContainer, range?.endContainer);
    }
  }

  keyPressListener(e: KeyboardEvent): void {
    // this.textarena.logger.info('keyPress', e);
    // e.preventDefault();
    // e.stopPropagation();
  }

  keyDownListener(e: KeyboardEvent): void {
    const result = this.checkEvent(e);
    if (result === 'input') {
      const s = window.getSelection();
      const range = s ? s.getRangeAt(0) : undefined;
      const isCollapsed = s && s.isCollapsed;
      if (!isCollapsed) {
        // TODO remove selection
      }
    }
    if (result === 'prevent') {
      e.cancelBubble = true;
      e.returnValue = false;
      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
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
