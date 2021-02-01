import { html, render } from 'lit-html';
import ArenaLogger from 'ArenaLogger';
import ElementHelper from 'ElementHelper';
import EventManager from 'EventManager';

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

const typeCodes = invertObject(typeKeys);

const selectionCodes = invertObject(selectionKeys);

const specialCodes = invertObject(specialKeys);

export default class ArenaViewer {
  inputListenerInstance: ((e: Event) => void);

  beforeinputListenerInstance: ((e: Event) => void);

  mouseUpListenerInstance: (() => void);

  keyUpListenerInstance: ((e: KeyboardEvent) => void);

  keyPressListenerInstance: ((e: KeyboardEvent) => void);

  keyDownListenerInstance: ((e: KeyboardEvent) => void);

  selectListenerInstance: (() => void);

  pasteListenerInstance: ((event: ClipboardEvent) => void);

  constructor(
    private editor: ElementHelper,
    private logger: ArenaLogger,
    private eventManager: EventManager,
  ) {
    this.inputListenerInstance = this.inputListener.bind(this);
    this.beforeinputListenerInstance = this.beforeinputListener.bind(this);
    this.mouseUpListenerInstance = this.mouseUpListener.bind(this);
    this.keyUpListenerInstance = this.keyUpListener.bind(this);
    this.keyPressListenerInstance = this.keyPressListener.bind(this);
    this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.selectListenerInstance = this.selectListener.bind(this);
    this.pasteListenerInstance = this.pasteListener.bind(this);
    this.eventManager.subscribe('turnOn', () => {
      document.addEventListener('input', this.inputListenerInstance, false);
      document.addEventListener('beforeinput', this.beforeinputListenerInstance, false);
      document.addEventListener('mouseup', this.mouseUpListenerInstance, false);
      document.addEventListener('keyup', this.keyUpListenerInstance, false);
      document.addEventListener('keypress', this.keyPressListenerInstance, false);
      document.addEventListener('keydown', this.keyDownListenerInstance, false);
      document.addEventListener('paste', this.pasteListenerInstance, false);
      document.addEventListener('selectionchange', this.selectListenerInstance, false);
    });
    this.eventManager.subscribe('turnOff', () => {
      this.editor.removeEventListener('input', this.inputListenerInstance);
      this.editor.removeEventListener('mouseup', this.mouseUpListenerInstance);
      this.editor.removeEventListener('keyup', this.keyUpListenerInstance);
      this.editor.removeEventListener('keypress', this.keyPressListenerInstance);
      this.editor.removeEventListener('keydown', this.keyDownListenerInstance);
      this.editor.removeEventListener('paste', this.pasteListenerInstance);
      document.removeEventListener('selectionchange', this.selectListenerInstance);
      this.editor.stopObserve();
    });
  }

  render() {
    render(html`<p>sdf</p>`, this.editor.getElem());
  }

  inputListener(e: Event): void {
    // this.logger.info('input', e);
    e.preventDefault();
    e.stopPropagation();
  }

  beforeinputListener(e: Event): void {
    this.logger.info('beforeinput', e);
    e.preventDefault();
    e.stopPropagation();
  }

  mouseUpListener(): void {
    // this.logger.info('mouseUp');
  }

  keyUpListener(e: KeyboardEvent): void {
    // this.logger.info('keyUp', e);
    e.preventDefault();
    e.stopPropagation();
  }

  keyPressListener(e: KeyboardEvent): void {
    // this.logger.info('keyPress', e);
    e.preventDefault();
    e.stopPropagation();
  }

  keyDownListener(e: KeyboardEvent): boolean {
    e.preventDefault();
    e.stopPropagation();
    // this.logger.info('keyDown', e);

    const modifiers = {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey,
    };
    let code;
    if (e.keyCode) {
      code = e.keyCode;
    } else if (e.which) {
      code = e.which;
    }
    const character = code ? String.fromCharCode(code).toLowerCase() : undefined;
    if (!code) {
      return false;
    }
    if (specialCodes[code]) {
      // this.logger.info(`keyDown: ${specialCodes[code]}`);
      // special code
    } else if (selectionCodes[code]) {
      // this.logger.info(`keyDown true: ${selectionCodes[code]}`);
      return true;
    } else if (typeCodes[code]) {
      // this.logger.info(`keyDown true: ${typeCodes[code]}`);
      return true;
    } else if (modifiers.alt || modifiers.ctrl || modifiers.meta) {
      this.logger.info(`keyDown: ${character}`, modifiers, e);
      // modifier + character
      e.stopPropagation();
      e.preventDefault();
      return false;
    } else {
      this.logger.info(`keyDown true: ${character}`);
      return true;
    }
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
    return false;
  }

  pasteListener(e: ClipboardEvent): void {
    // this.logger.info('pasteListener', e);
  }

  selectListener(): void {
    // this.logger.info('select');
  }
}
