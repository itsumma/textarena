import ArenaParser from 'ArenaParser';
import CreatorContext from 'interfaces/CreatorContext';
import { IMAGE_WRAPPER } from 'common/constants';
import ElementHelper from 'ElementHelper';
import EventManager from './EventManager';
// import ChangeDataListener from "./interfaces/ChangeHandler";
import { isDescendant } from './utils';
import * as utils from './utils';

export const emptyStrs = ['<p><br></p>', '<p><br/></p>', '<p></p>'];

// eslint-disable-next-line no-shadow

export default class Manipulator {
  inputListenerInstance: ((e: Event) => void);

  mouseUpListenerInstance: (() => void);

  keyUpListenerInstance: ((e: KeyboardEvent) => void);

  keyPressListenerInstance: ((e: KeyboardEvent) => void);

  // keyDownListenerInstance: ((e: KeyboardEvent) => void);

  selectListenerInstance: (() => void);

  pasteListenerInstance: ((event: ClipboardEvent) => void);

  lastSelectionStatus: SelectionStatus = SelectionStatus.Unselected;

  lastSelectionRange: Range | undefined;

  lastFocusElement: HTMLElement | undefined;

  constructor(
    private elem: ElementHelper,
    private eventManager: EventManager,
    private parser: ArenaParser,
  ) {
    this.inputListenerInstance = this.inputListener.bind(this);
    this.mouseUpListenerInstance = this.mouseUpListener.bind(this);
    this.keyUpListenerInstance = this.keyUpListener.bind(this);
    this.keyPressListenerInstance = this.keyPressListener.bind(this);
    // this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.selectListenerInstance = this.selectListener.bind(this);
    this.pasteListenerInstance = this.pasteListener.bind(this);
    this.eventManager.subscribe('turnOn', () => {
      this.elem.addEventListener('input', this.inputListenerInstance, false);
      this.elem.addEventListener('mouseup', this.mouseUpListenerInstance, false);
      this.elem.addEventListener('keyup', this.keyUpListenerInstance, false);
      this.elem.addEventListener('keypress', this.keyPressListenerInstance, false);
      // this.elem.addEventListener('keydown', this.keyDownListenerInstance, false);
      this.elem.addEventListener('paste', this.pasteListenerInstance, false);
      document.addEventListener('selectionchange', this.selectListenerInstance, false);
    });
    this.eventManager.subscribe('turnOff', () => {
      this.elem.removeEventListener('input', this.inputListenerInstance);
      this.elem.removeEventListener('mouseup', this.mouseUpListenerInstance);
      this.elem.removeEventListener('keyup', this.keyUpListenerInstance);
      this.elem.removeEventListener('keypress', this.keyPressListenerInstance);
      // this.elem.removeEventListener('keydown', this.keyDownListenerInstance);
      this.elem.removeEventListener('paste', this.pasteListenerInstance);
      document.removeEventListener('selectionchange', this.selectListenerInstance);
      this.elem.stopObserve();
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
        this.processFocusElementChange(focucElement);
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
    this.eventManager.fire('textChanged');
  }

  mouseUpListener(): void {
    this.fireSelectionStatus();
  }

  keyPressListener(e: KeyboardEvent): void {
    if (!this.parser.prepareAndPasteText(e.key)) {
      e.preventDefault();
      const focusElement = utils.getFocusElement();
      if (focusElement) {
        this.parser.checkElement(focusElement);
      }
    }
    // this.eventManager.fire('textChanged');
  }

  keyUpListener(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      const focusElement = utils.getFocusElement();
      if (focusElement
        && focusElement.tagName === 'P'
        && focusElement.parentElement !== this.elem.getElem()) {
        // есть куда повышать уровень
        // если мы в пустом параграфе и
        const prevElem = (focusElement?.previousSibling as Element);
        const prevPrevElem = (prevElem?.previousSibling as Element);
        if (
          prevElem && prevElem.tagName === 'P'
          && prevElem.textContent === ''
          && (focusElement.textContent === '' || (prevPrevElem && prevPrevElem.textContent === ''))
        ) {
          // если два пустых параграфа подряд
          console.log('two empty paragraphs');
          const parent = focusElement.parentElement;
          if (parent) {
            const offsetStart = Array.from(parent.children).indexOf(prevElem);
            const offsetEnd = Array.from(parent.children).indexOf(focusElement);
            if (offsetStart !== -1 && offsetEnd !== -1) {
              // const range = new Range();
              // range.setStart(parent, offsetStart);
              // range.setStart(parent, offsetEnd + 1);
              // console.log(parent, offsetStart, offsetEnd + 1);
              const s = document.getSelection();
              if (!s) {
                return;
              }
              // s.setBaseAndExtent(parent, offsetStart, parent, offsetEnd + 1);
              // range.deleteContents();
              // console.log(s.getRangeAt(0), prevElem, focusElement);
              // s.removeAllRanges();
              // s.addRange(range);
              // document.execCommand('insertHTML', false, '<p><br/></p>');
              // document.execCommand('InsertParagraph');
              // document.execCommand('forwardDelete');
              // document.execCommand('delete');
              document.execCommand('Outdent');
            }
          }
        }
      }

      if (focusElement?.tagName === 'DIV') {
        document.execCommand('formatBlock', false, 'p');
      }
      if (focusElement?.tagName === IMAGE_WRAPPER) {
        document.execCommand('delete');
        document.execCommand('insertHTML', false, emptyStrs[0]);
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
    const {
      innerHTML,
      firstChild,
    } = this.elem.getElem();
    if (innerHTML) {
      if (firstChild && firstChild.nodeName === '#text') {
        const newFirstChild = document.createElement('p');
        newFirstChild.append(firstChild.cloneNode());

        const range = document.createRange();
        range.selectNodeContents(this.elem.getElem());
        range.setStartAfter(firstChild);

        const children = range.extractContents();
        children.prepend(newFirstChild);

        this.elem.setInnerHTML('');
        this.elem.append(children);
      }
    } else {
      this.elem.setInnerHTML(emptyStrs[0]);
    }
  }

  pasteListener(event: ClipboardEvent): void {
    event.preventDefault();
    const { clipboardData } = event;
    if (!clipboardData) {
      return;
    }
    const types: string[] = [...clipboardData.types || []];
    if (types.includes('Files')) {
      if (event.clipboardData === null || !event.clipboardData.files) return;
      const file = event.clipboardData.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e === null || !e.target || !e.target.result || typeof e.target.result !== 'string') {
          return;
        }
        utils.insertImage(e.target.result, this.getContext());
        this.inputListener();
      };
      reader.readAsDataURL(file);
    } else if (types.includes('text/html')) {
      const html = clipboardData.getData('text/html');
      if (!html) {
        return;
      }
      if (this.parser.prepareAndPasteHtml(html)) {
        const focusElement = utils.getFocusElement();
        if (focusElement) {
          this.parser.checkElement(focusElement);
        }
      }
    } else if (types.includes('text/plain')) {
      const text = clipboardData.getData('text/plain');
      if (!text) {
        return;
      }
      if (this.parser.prepareAndPasteText(text)) {
        const focusElement = utils.getFocusElement();
        if (focusElement) {
          this.parser.checkElement(focusElement);
        }
      }
    }
    this.inputListener();
  }

  getContext(): CreatorContext {
    return {
      focusElement: utils.getFocusElement(),
      eventManager: this.eventManager,
      parser: this.parser,
    };
  }

  processFocusElementChange(focusElement: HTMLElement): void {
    this.eventManager.fire({
      name: 'changeFocusElement',
      target: focusElement,
    });
    this.lastFocusElement = focusElement;
  }
}
