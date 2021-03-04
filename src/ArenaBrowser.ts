/* eslint-disable no-bitwise */
import InputEvent from 'events/InputEvent';
import RemoveEvent from 'events/RemoveEvent';
import SelectionEvent from 'events/SelectionEvent';
import CommandEvent, { keyboardKeys } from 'events/CommandEvent';
import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';
import Textarena from 'Textarena';
import { isDescendant } from 'utils';
import PasteEvent from 'events/PasteEvent';
import CopyEvent from 'events/CopyEvent';
import CutEvent from 'events/CutEvent';
import BrowserCommandEvent from 'events/BrowserCommandEvent';

enum SelectionStatus {
  Selected,
  Unselected,
}

const Modifiers = {
  Shift: 1,
  Ctrl: 2,
  Alt: 4,
  Meta: 8,
};

const modifiersKeys = {
  Shift: 16,
  Ctrl: 17,
  Alt: 18,
  Meta: 91,
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
  enter: 13,
};

const reservedKeys = {
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

const reservedCodes = invertObject(reservedKeys);

export default class ArenaBrowser {
  private inputListenerInstance: ((e: Event) => void);

  private beforeinputListenerInstance: ((e: Event) => void);

  private mouseUpListenerInstance: ((e: MouseEvent) => void);

  private keyUpListenerInstance: ((e: KeyboardEvent) => void);

  private keyPressListenerInstance: ((e: KeyboardEvent) => void);

  private keyDownListenerInstance: ((e: KeyboardEvent) => void);

  private selectListenerInstance: ((e: Event) => void);

  private pasteListenerInstance: ((event: ClipboardEvent) => void);

  private lastSelectionStatus: SelectionStatus = SelectionStatus.Unselected;

  private lastSelectionRange: Range | undefined;

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

  protected checkSelection(): void {
    const s = window.getSelection();
    if (!s) {
      return;
    }

    if (this.lastSelectionStatus === SelectionStatus.Selected
      && s.isCollapsed) {
      this.lastSelectionStatus = SelectionStatus.Unselected;
      this.textarena.eventManager.fire('textUnselected');
      this.lastSelectionRange = undefined;
      return;
    }
    if (!s.isCollapsed
      && s.anchorNode
      && isDescendant(this.textarena.editor, s.anchorNode)) {
      if (this.lastSelectionStatus === SelectionStatus.Unselected) {
        this.lastSelectionStatus = SelectionStatus.Selected;
        this.textarena.eventManager.fire('textSelected');
        this.lastSelectionRange = s.getRangeAt(0);
      } else if (this.lastSelectionRange) {
        const newRange = s.getRangeAt(0);
        if (newRange.startContainer !== this.lastSelectionRange.startContainer
          || newRange.startOffset !== this.lastSelectionRange.startOffset
          || newRange.endContainer !== this.lastSelectionRange.endContainer
          || newRange.endOffset !== this.lastSelectionRange.endOffset) {
          this.textarena.eventManager.fire('selectionChanged');
          this.lastSelectionRange = newRange;
        }
      }
    }
  }

  protected checkKeyboardEvent(prefix: string, e: KeyboardEvent): ArenaKeyboardEvent | undefined {
    const {
      keyCode,
      code,
      shiftKey,
      ctrlKey,
      altKey,
      metaKey,
    } = e;
    const modifiers = {
      Shift: shiftKey,
      Ctrl: ctrlKey,
      Alt: altKey,
      Meta: metaKey,
    };
    const modifiersSum = (shiftKey ? Modifiers.Shift : 0)
      | (ctrlKey ? Modifiers.Ctrl : 0)
      | (altKey ? Modifiers.Alt : 0)
      | (metaKey ? Modifiers.Meta : 0);
    const character = e.key;
    if (modifiersCodes[keyCode]) {
      return undefined;
    }
    if (reservedCodes[keyCode]) {
      return new BrowserCommandEvent(e);
    }
    if (code === 'KeyD' && modifiersSum === Modifiers.Ctrl) {
      return new BrowserCommandEvent(e);
    }
    if (code === 'KeyF' && modifiersSum === Modifiers.Ctrl) {
      return new BrowserCommandEvent(e);
    }
    if (code === 'KeyG'
      && (modifiersSum ^ (Modifiers.Ctrl | Modifiers.Shift) & modifiersSum) === 0) {
      return new BrowserCommandEvent(e);
    }
    if (code === 'KeyH' && modifiersSum === Modifiers.Ctrl) {
      return new BrowserCommandEvent(e);
    }
    if (code === 'KeyJ' && modifiersSum === Modifiers.Ctrl) {
      return new BrowserCommandEvent(e);
    }
    if (code === 'KeyO' && modifiersSum === Modifiers.Ctrl) {
      return new BrowserCommandEvent(e);
    }
    // if (code === 'KeyP' && modifiersSum === Modifiers.Ctrl) {
    //   return new BrowserCommandEvent(e);
    // }
    // if (code === 'KeyS' && modifiersSum === Modifiers.Ctrl) {
    //   return new BrowserCommandEvent(e);
    // }
    if (code === 'KeyE' && modifiersSum === Modifiers.Ctrl) {
      return new BrowserCommandEvent(e);
    }
    if (code === 'KeyK' && modifiersSum === Modifiers.Ctrl) {
      return new BrowserCommandEvent(e);
    }
    if (code === 'Delete' && modifiersSum === (Modifiers.Ctrl | Modifiers.Shift)) {
      return new BrowserCommandEvent(e);
    }
    if (code === 'KeyF' && modifiersSum === Modifiers.Alt) {
      return new BrowserCommandEvent(e);
    }
    if (/^Digit\d$/.test(code) && modifiersSum === Modifiers.Ctrl) {
      return new BrowserCommandEvent(e);
    }

    if (selectionCodes[keyCode]) {
      return new SelectionEvent(e);
    }
    if (code === 'KeyA' && modifiersSum === Modifiers.Ctrl) {
      return new SelectionEvent(e);
    }
    if (code === 'KeyC' && modifiersSum === Modifiers.Ctrl) {
      return new CopyEvent(e);
    }
    if (code === 'KeyV' && modifiersSum === Modifiers.Ctrl) {
      return new PasteEvent(e);
    }
    if (code === 'KeyX' && modifiersSum === Modifiers.Ctrl) {
      return new CutEvent(e);
    }
    if (removeCodes[keyCode]) {
      return new RemoveEvent(
        e,
        removeCodes[keyCode] === 'delete' ? 'forward' : 'backward',
      );
    }
    if (specialCodes[keyCode] || modifiersSum > Modifiers.Shift) {
      const mod = Object.entries(modifiers).filter(([, t]) => t).map(([m]) => m);
      this.textarena.logger.info(`${prefix} command ${mod.join(' + ')} + ${code}`, e);
      if (code && keyboardKeys.includes(code)) {
        return new CommandEvent(e, code, mod);
      }
      return undefined;
    }
    if (character) {
      return new InputEvent(e, character);
    }
    return undefined;
  }

  private inputListener(e: Event): void {
    this.textarena.logger.log('Input event', e);
  }

  private beforeinputListener(e: Event): void {
    this.textarena.logger.log('Beforeinput event', e);
  }

  private mouseUpListener(e: MouseEvent): void {
    this.textarena.logger.log('MouseUp event', e);
    this.checkSelection();
  }

  private keyUpListener(e: KeyboardEvent): void {
    this.textarena.logger.log('KeyUp event', e);
  }

  private keyPressListener(e: KeyboardEvent): void {
    this.textarena.logger.log('KeyPress event', e);
  }

  private keyDownListener(e: KeyboardEvent): void {
    const event = this.checkKeyboardEvent('keyDown', e);
    this.textarena.logger.log('KeyDown event', event, e);
    if (event instanceof SelectionEvent
      || event instanceof BrowserCommandEvent
      || event instanceof CopyEvent
      || event instanceof PasteEvent) {
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
    const selection = this.textarena.view.getArenaSelection();
    if (!selection) {
      return;
    }
    if (event instanceof CommandEvent) {
      const newSelection = this.textarena.commandManager.exec(selection, event);
      this.textarena.view.render(newSelection);
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

  private pasteListener(e: ClipboardEvent): void {
    this.textarena.logger.log('Paste event', e);
    e.preventDefault();
    const { clipboardData } = e;
    if (!clipboardData) {
      return;
    }
    const types: string[] = [...clipboardData.types || []];
    if (types.includes('text/html')) {
      const html = clipboardData.getData('text/html');
      if (!html) {
        return;
      }
      console.log(e, html);
      const selection = this.textarena.view.getArenaSelection();
      if (selection) {
        const newSelection = this.textarena.model.insertHtml(selection, html);
        this.textarena.view.render(newSelection);
      }
    } else if (types.includes('text/plain')) {
      const text = clipboardData.getData('text/plain');
      if (!text) {
        return;
      }
      const selection = this.textarena.view.getArenaSelection();
      if (selection) {
        const newSelection = this.textarena.model.insertText(selection, text);
        this.textarena.view.render(newSelection);
      }
    }
  }

  private selectListener(e: Event): void {
    this.textarena.logger.log('Select event', e);
    this.checkSelection();
  }
}
