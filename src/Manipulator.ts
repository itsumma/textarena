import EventManager from './EventManager';

// import ChangeDataListener from "./interfaces/ChangeHandler";
import { isDescendant } from './utils';
import * as utils from './utils';

export const emptyStrs = ['<p><br></p>', '<p><br/></p>', '<p></p>'];

// eslint-disable-next-line no-shadow
enum SelectionStatus {
  Selected,
  Unselected,
}

const pasteListener = (event: ClipboardEvent): void => {
  event.preventDefault();
  const { clipboardData } = event;
  if (!clipboardData) {
    return;
  }
  const types: string[] = [...clipboardData.types || []];
  if (types.includes('Files')) {
    utils.insertImage(event);
  } else if (types.includes('text/html')) {
    const html = clipboardData.getData('text/html');
    if (!html) {
      return;
    }
    const clearHtml = utils.clearHtml(html);
    utils.insert(clearHtml);
  } else if (types.includes('text/plain')) {
    const text = clipboardData.getData('text/plain');
    if (!text) {
      return;
    }
    utils.insert(utils.convertToHTML(text));
  }
};

export default class Manipulator {
  inputListenerInstance: (() => void);

  mouseUpListenerInstance: (() => void);

  keyUpListenerInstance: ((e: KeyboardEvent) => void);

  // keyDownListenerInstance: ((e: KeyboardEvent) => void);

  selectListenerInstance: (() => void);

  pasteListenerInstance: ((event: ClipboardEvent) => void);

  lastSelectionStatus: SelectionStatus = SelectionStatus.Unselected;

  lastSelectionRange: Range | undefined;

  lastFocusElement: HTMLElement | undefined;

  constructor(private elem: HTMLElement, private eventManager: EventManager) {
    this.inputListenerInstance = this.inputListener.bind(this);
    this.mouseUpListenerInstance = this.mouseUpListener.bind(this);
    this.keyUpListenerInstance = this.keyUpListener.bind(this);
    // this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.selectListenerInstance = this.selectListener.bind(this);
    this.pasteListenerInstance = pasteListener.bind(this);
    this.eventManager.subscribe('turnOn', () => {
      this.elem.addEventListener('input', this.inputListenerInstance, false);
      this.elem.addEventListener('mouseup', this.mouseUpListenerInstance, false);
      this.elem.addEventListener('keyup', this.keyUpListenerInstance, false);
      // this.elem.addEventListener('keydown', this.keyDownListenerInstance, false);
      this.elem.addEventListener('paste', this.pasteListenerInstance, false);
      document.addEventListener('selectionchange', this.selectListenerInstance, false);
    });
    this.eventManager.subscribe('turnOff', () => {
      this.elem.removeEventListener('input', this.inputListenerInstance);
      this.elem.removeEventListener('mouseup', this.mouseUpListenerInstance);
      this.elem.removeEventListener('keyup', this.keyUpListenerInstance);
      // this.elem.removeEventListener('keydown', this.keyDownListenerInstance);
      this.elem.removeEventListener('paste', this.pasteListenerInstance);
      document.removeEventListener('selectionchange', this.selectListenerInstance);
    });
  }

  fireSelectionStatus(onlyUnselection = false): boolean {
    const s = window.getSelection();
    if (!s) {
      return false;
    }
    const focucElement = utils.getFocusElement();
    if (!focucElement) {
      return false;
    }
    if (!focucElement.closest('.textarena-editor')) {
      return false;
    }
    if (s.isCollapsed) {
      if (this.lastFocusElement !== focucElement) {
        this.eventManager.fire({
          name: 'changeFocusElement',
          target: focucElement,
        });
        this.lastFocusElement = focucElement;
      }
    }
    if (this.lastSelectionStatus === SelectionStatus.Selected
      && s.isCollapsed) {
      this.lastSelectionStatus = SelectionStatus.Unselected;
      this.eventManager.fire('textUnselected');
      this.lastSelectionRange = undefined;
      return true;
    }
    if (onlyUnselection) {
      return false;
    }
    if (this.lastSelectionStatus === SelectionStatus.Unselected
      && !s.isCollapsed
      && s.anchorNode
      && isDescendant(this.elem, s.anchorNode)) {
      this.lastSelectionStatus = SelectionStatus.Selected;
      this.eventManager.fire('textSelected');
      this.lastSelectionRange = s.getRangeAt(0);
      return true;
    }
    return false;
  }

  fireSelectionChange(): void {
    if (!this.lastSelectionRange) {
      return;
    }
    const s = window.getSelection();
    if (!s) {
      return;
    }
    const newRange = s.getRangeAt(0);
    if (newRange.startContainer !== this.lastSelectionRange.startContainer
      || newRange.startOffset !== this.lastSelectionRange.startOffset
      || newRange.endContainer !== this.lastSelectionRange.endContainer
      || newRange.endOffset !== this.lastSelectionRange.endOffset) {
      this.eventManager.fire('selectionChanged');
      this.lastSelectionRange = newRange;
    }
  }

  inputListener(): void {
    this.checkFirstLine();
    // const focusElement = utils.getFocusElement();
    // eslint-disable-next-line no-console
    // console.log(focusElement);
    // if (focusElement?.innerHTML) {
    //   focusElement.innerHTML = utils.clearHtml(focusElement.innerHTML);
    // }
    this.eventManager.fire('textChanged');
  }

  mouseUpListener(): void {
    this.fireSelectionStatus();
  }

  keyUpListener(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      const focusElement = utils.getFocusElement();
      if (focusElement?.tagName === 'DIV') {
        document.execCommand('formatBlock', false, 'p');
      }
    }
    if (!this.fireSelectionStatus()) {
      this.fireSelectionChange();
    }
  }

  // keyDownListener(e: KeyboardEvent) {
  // if (e.key === 'Enter') {
  // const focusElement = utils.getFocusElement();
  // console.log(focusElement);
  // if (focusElement?.tagName === 'DIV') {
  //   document.execCommand('formatBlock', false, 'p');
  // }
  // if (focusElement) {
  //   e.preventDefault();
  //   const p = document.createElement('p')
  //   p.innerHTML = '<br/>';
  //   // TODO remove empty element focucElement
  //   if (focusElement.parentNode) {
  //     if (focusElement.nextSibling) {
  //       focusElement.parentNode.insertBefore(p, focusElement.nextSibling);
  //     } else {
  //       focusElement.parentNode.appendChild(p);
  //     }
  //     const s = window.getSelection();
  //     const r = document.createRange();
  //     r.setStart(p, 0);
  //     r.setEnd(p, 0);
  //     if (s) {
  //       s.removeAllRanges();
  //       s.addRange(r);
  //     }
  //     p.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  //   }
  // }
  //   }
  // }

  selectListener(): void {
    this.fireSelectionStatus(true);
  }

  checkFirstLine(): void {
    if (this.elem.innerHTML) {
      const { firstChild } = this.elem;
      if (firstChild && firstChild.nodeName === '#text') {
        const newFirstChild = document.createElement('p');
        newFirstChild.append(firstChild.cloneNode());

        const range = document.createRange();
        range.selectNodeContents(this.elem);
        range.setStartAfter(firstChild);

        const children = range.extractContents();
        children.prepend(newFirstChild);

        this.elem.innerHTML = '';
        this.elem.append(children);
      }
    } else {
      [this.elem.innerHTML] = emptyStrs;
    }
  }
}
