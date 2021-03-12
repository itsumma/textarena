/* eslint-disable no-bitwise */
import InputEvent from 'events/InputEvent';
import RemoveEvent from 'events/RemoveEvent';
import SelectionEvent from 'events/SelectionEvent';
import CommandEvent from 'events/CommandEvent';
import ArenaKeyboardEvent from 'interfaces/ArenaKeyboardEvent';
import Textarena from 'Textarena';
import { isDescendant } from 'utils';
import PasteEvent from 'events/PasteEvent';
import CopyEvent from 'events/CopyEvent';
import CutEvent from 'events/CutEvent';
import BrowserCommandEvent from 'events/BrowserCommandEvent';
import { keyboardKeys, Modifiers } from 'ArenaCommandManager';
import ModifiersEvent from 'events/ModifiersEvent';

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

const removeCodes = invertObject(removeKeys);

const specialCodes = invertObject(specialKeys);

const reservedCodes = invertObject(reservedKeys);

export default class ArenaBrowser {
  private inputListenerInstance: ((e: Event) => void);

  // private beforeinputListenerInstance: ((e: Event) => void);

  private mouseUpListenerInstance: ((e: MouseEvent) => void);

  private keyUpListenerInstance: ((e: KeyboardEvent) => void);

  private keyPressListenerInstance: ((e: KeyboardEvent) => void);

  private keyDownListenerInstance: ((e: KeyboardEvent) => void);

  private selectListenerInstance: ((e: Event) => void);

  private pasteListenerInstance: ((event: ClipboardEvent) => void);

  private lastSelectionStatus = false;

  private lastSelectionRange: Range | undefined;

  constructor(
    private ta: Textarena,
  ) {
    this.inputListenerInstance = this.inputListener.bind(this);
    // this.beforeinputListenerInstance = this.beforeinputListener.bind(this);
    this.mouseUpListenerInstance = this.mouseUpListener.bind(this);
    this.keyUpListenerInstance = this.keyUpListener.bind(this);
    this.keyPressListenerInstance = this.keyPressListener.bind(this);
    this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.selectListenerInstance = this.selectListener.bind(this);
    this.pasteListenerInstance = this.pasteListener.bind(this);
    this.ta.eventManager.subscribe('turnOn', () => {
      this.ta.editor.addEventListener('input', this.inputListenerInstance, false);
      // this.textarena.editor.addEventListener('beforeinput',
      // this.beforeinputListenerInstance, false);
      this.ta.editor.addEventListener('mouseup', this.mouseUpListenerInstance, false);
      this.ta.editor.addEventListener('keyup', this.keyUpListenerInstance, false);
      this.ta.editor.addEventListener('keypress', this.keyPressListenerInstance, false);
      this.ta.editor.addEventListener('keydown', this.keyDownListenerInstance, false);
      this.ta.editor.addEventListener('paste', this.pasteListenerInstance, false);
      document.addEventListener('selectionchange', this.selectListenerInstance, false);
    });
    this.ta.eventManager.subscribe('turnOff', () => {
      this.ta.editor.removeEventListener('input', this.inputListenerInstance);
      // this.textarena.editor.removeEventListener('beforeinput', this.beforeinputListenerInstance);
      this.ta.editor.removeEventListener('mouseup', this.mouseUpListenerInstance);
      this.ta.editor.removeEventListener('keyup', this.keyUpListenerInstance);
      this.ta.editor.removeEventListener('keypress', this.keyPressListenerInstance);
      this.ta.editor.removeEventListener('keydown', this.keyDownListenerInstance);
      this.ta.editor.removeEventListener('paste', this.pasteListenerInstance);
      document.removeEventListener('selectionchange', this.selectListenerInstance);
      // this.textarena.editor.stopObserve();
    });
  }

  protected checkSelection(): void {
    const s = window.getSelection();
    if (!s) {
      return;
    }
    if (!s.anchorNode || !isDescendant(this.ta.editor, s.anchorNode)) {
      return;
    }

    this.ta.eventManager.fire('moveCursor');

    if (this.lastSelectionStatus && s.isCollapsed) {
      this.lastSelectionStatus = false;
      this.ta.eventManager.fire('textUnselected');
      this.lastSelectionRange = undefined;
      return;
    }
    if (!s.isCollapsed) {
      if (!this.lastSelectionStatus) {
        this.lastSelectionStatus = true;
        this.ta.eventManager.fire('textSelected');
        this.lastSelectionRange = s.getRangeAt(0);
      } else if (this.lastSelectionRange) {
        const newRange = s.getRangeAt(0);
        if (newRange.startContainer !== this.lastSelectionRange.startContainer
          || newRange.startOffset !== this.lastSelectionRange.startOffset
          || newRange.endContainer !== this.lastSelectionRange.endContainer
          || newRange.endOffset !== this.lastSelectionRange.endOffset) {
          this.ta.eventManager.fire('selectionChanged');
          this.lastSelectionRange = newRange;
        }
      }
    }
  }

  public getModifiersSum(e: KeyboardEvent): number {
    const {
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
    return this.ta.commandManager.getModifiersSum(modifiers);
  }

  protected checkKeyboardEvent(prefix: string, e: KeyboardEvent): ArenaKeyboardEvent | undefined {
    const {
      keyCode,
      code,
    } = e;
    const modifiersSum = this.getModifiersSum(e);
    const character = e.key;
    if (modifiersCodes[keyCode]) {
      return new ModifiersEvent(e, modifiersSum);
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
      this.ta.logger.info(`${prefix} command ${modifiersSum} + ${code}`, e);
      if (code && keyboardKeys.includes(code)) {
        return new CommandEvent(e, code, modifiersSum);
      }
      return undefined;
    }
    if (character) {
      return new InputEvent(e, character);
    }
    return undefined;
  }

  private inputListener(e: Event): void {
    this.ta.logger.log('Input event', e);
  }

  // private beforeinputListener(e: Event): void {
  //   this.textarena.logger.log('Beforeinput event', e);
  // }

  private mouseUpListener(e: MouseEvent): void {
    this.ta.logger.log('MouseUp event', e);
    this.checkSelection();
  }

  private keyUpListener(e: KeyboardEvent): void {
    this.ta.logger.log('KeyUp event', e);
    const modifiersSum = this.getModifiersSum(e);
    this.ta.eventManager.fire('moveCursor');
    this.ta.eventManager.fire({ name: 'keyUp', data: modifiersSum });
  }

  private keyPressListener(e: KeyboardEvent): void {
    this.ta.logger.log('KeyPress event', e);
  }

  private keyDownListener(e: KeyboardEvent): void {
    const event = this.checkKeyboardEvent('keyDown', e);
    this.ta.logger.log('KeyDown event', event, e);
    if (event instanceof SelectionEvent
      || event instanceof BrowserCommandEvent
      || event instanceof CopyEvent
      || event instanceof PasteEvent) {
      // allow
      return;
    }
    if (event instanceof CutEvent) {
      const selection = this.ta.view.getArenaSelection();
      if (selection) {
        const newSelection = this.ta.model.removeSelection(selection, selection.direction);
        this.ta.view.render(newSelection);
      }
      return;
    }
    e.cancelBubble = true;
    e.returnValue = false;
    e.stopPropagation();
    e.preventDefault();
    if (!event) {
      return;
    }
    if (event instanceof ModifiersEvent) {
      this.ta.eventManager.fire({ name: 'keyDown', data: event.sum });
    }
    const selection = this.ta.view.getArenaSelection();
    if (!selection) {
      return;
    }
    if (event instanceof CommandEvent) {
      const { command, modifiersSum } = event;
      const newSelection = this.ta.commandManager.execShortcut(selection, modifiersSum, command);
      console.log(newSelection);
      this.ta.view.render(newSelection);
      return;
    }
    if (event instanceof InputEvent) {
      const newSelection = this.ta.model.insertTextToModel(selection, event.character, true);
      this.ta.view.render(newSelection);
    }
    if (event instanceof RemoveEvent) {
      const newSelection = this.ta.model.removeSelection(selection, event.direction);
      this.ta.view.render(newSelection);
    }
  }

  private pasteListener(e: ClipboardEvent): void {
    this.ta.logger.log('Paste event', e);
    e.preventDefault();
    const { clipboardData } = e;
    if (!clipboardData) {
      return;
    }
    const types: string[] = [...clipboardData.types || []];
    if (types.includes('text/html')) {
      let html = clipboardData.getData('text/html');
      if (!html) {
        return;
      }
      const selection = this.ta.view.getArenaSelection();
      if (selection) {
        const matchStart = /<!--StartFragment-->/.exec(html);
        if (matchStart) {
          html = html.slice(matchStart.index + matchStart[0].length);
        }
        const matchEnd = /<!--EndFragment-->/.exec(html);
        if (matchEnd) {
          html = html.slice(0, matchEnd.index);
        }
        console.log(`insert html «${html}»`);
        const newSelection = this.ta.model.insertHtml(selection, html);
        this.ta.view.render(newSelection);
      }
    } else if (types.includes('text/plain')) {
      const text = clipboardData.getData('text/plain');
      if (!text) {
        return;
      }
      const selection = this.ta.view.getArenaSelection();
      if (selection) {
        const newSelection = this.ta.model.insertTextToModel(selection, text);
        this.ta.view.render(newSelection);
      }
    }
  }

  private selectListener(e: Event): void {
    this.ta.logger.log('Select event', e);
    this.checkSelection();
  }
}
