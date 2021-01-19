import { IMAGE_WRAPPER } from 'common/constants';
import ElementHelper from 'ElementHelper';
import ArenaParser from 'ArenaParser';
import creators from './creators';
import EventManager, { MediaEvent } from './EventManager';
import CreatorBarOptions from './interfaces/CreatorBarOptions';
import CreatorContext from './interfaces/CreatorContext';
import CreatorOptions from './interfaces/CreatorOptions';
import { getFocusElement, isMac } from './utils';
import * as utils from './utils';

type Creator = {
  elem: ElementHelper;
  options: CreatorOptions;
};

type KeysForTool = {
  [key: string]: CreatorOptions;
};

export default class CreatorBar {
  elem: ElementHelper;

  list: ElementHelper;

  controlKeyShowed = false;

  controlKeys: KeysForTool = {};

  altKeyShowed = false;

  altKeys: KeysForTool = {};

  creators: Creator[] = [];

  showed = false;

  active = false;

  currentFocusElement: HTMLElement | undefined;

  keyDownListenerInstance: ((e: KeyboardEvent) => void);

  keyUpListenerInstance: ((e: KeyboardEvent) => void);

  constructor(
    private root: ElementHelper,
    private eventManager: EventManager,
    private parser: ArenaParser,
  ) {
    this.elem = new ElementHelper('DIV', 'textarena-creator');
    this.elem.onClick(() => {
      this.closeList();
    });
    this.list = new ElementHelper('DIV', 'textarena-creator__list');
    this.hide();
    const createButton = new ElementHelper('BUTTON', 'textarena-creator__create-button');
    createButton.onClick((e: MouseEvent) => {
      e.stopPropagation();
      if (this.active) {
        this.closeList();
      } else {
        this.openList();
      }
    });
    createButton.setInnerHTML(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 14 14">
    <path d="M8.05 5.8h4.625a1.125 1.125 0 0 1 0 2.25H8.05v4.625a1.125 1.125 0 0 1-2.25 0V8.05H1.125a1.125 1.125 0 0 1 0-2.25H5.8V1.125a1.125 1.125 0 0 1 2.25 0V5.8z"/>
    </svg>`);
    // const MACOS = isMac();
    // const altKey = MACOS ? '⌥' : 'Alt';
    const placeholder = new ElementHelper(
      'DIV',
      'textarena-creator__placeholder',
      // `Введите текст или ${altKey}-Q`,
    );
    this.elem.appendChild(createButton);
    this.elem.appendChild(this.list);
    this.elem.appendChild(placeholder);

    this.eventManager.subscribe('textChanged', () => {
      const focusElement = getFocusElement();
      if (focusElement) {
        this.handleElementChange(focusElement);
      }
    });
    this.eventManager.subscribe('changeFocusElement', (event?: string | MediaEvent) => {
      if (typeof event === 'object' && event.target) {
        this.handleElementChange(event.target);
      }
    });
    this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.eventManager.subscribe('turnOn', () => {
      this.root.addEventListener('keydown', this.keyDownListenerInstance, false);
      this.elem.addEventListener('keydown', this.keyDownListenerInstance, false);
      this.elem.addEventListener('keyup', this.keyUpListenerInstance, false);
    });
    this.keyUpListenerInstance = this.keyUpListener.bind(this);
    this.eventManager.subscribe('turnOff', () => {
      this.root.removeEventListener('keydown', this.keyDownListenerInstance);
      this.elem.removeEventListener('keydown', this.keyDownListenerInstance);
      this.elem.removeEventListener('keyup', this.keyUpListenerInstance);
    });
  }

  handleElementChange(element: HTMLElement): void {
    if (!element) return;
    if ([IMAGE_WRAPPER, 'LI'].includes(element.tagName)) {
      this.hide();
    } else if (!element.textContent) {
      this.currentFocusElement = element;
      this.show(element);
    } else {
      this.currentFocusElement = undefined;
      this.hide();
    }
  }

  keyDownListener(e: KeyboardEvent): void {
    if (this.showed && !this.active && e.code === 'KeyQ' && e.altKey) {
      this.openList();
      return;
    }
    if (this.showed && this.active && e.key === 'Escape') {
      this.closeList();
      return;
    }
    if (this.showed && this.active && e.key === 'ArrowRight') {
      const activeCreator = this.creators.find(
        (some) => some.elem.getElem() === document.activeElement,
      );
      if (activeCreator) {
        const index = this.creators.indexOf(activeCreator);
        if (index === this.creators.length - 1) {
          this.creators[0].elem.focus();
        } else {
          this.creators[index + 1].elem.focus();
        }
      } else if (this.creators.length > 0) {
        this.creators[0].elem.focus();
      }
      return;
    }
    if (this.showed && this.active && e.key === 'ArrowLeft') {
      const activeCreator = this.creators.find(
        (some) => some.elem.getElem() === document.activeElement,
      );
      if (activeCreator) {
        const index = this.creators.indexOf(activeCreator);
        if (index === 0) {
          this.creators[this.creators.length - 1].elem.focus();
        } else {
          this.creators[index - 1].elem.focus();
        }
      } else if (this.creators.length > 0) {
        this.creators[this.creators.length - 1].elem.focus();
      }
      return;
    }
    const MACOS = isMac();
    const ctrlKey = MACOS ? e.metaKey : e.ctrlKey;
    const key = MACOS ? 'Meta' : 'Control';
    if (!this.controlKeyShowed && this.showed && this.active && e.key === key && !e.altKey) {
      e.preventDefault();
      this.elem.addClass('textarena-creator_show-control-key');
      this.controlKeyShowed = true;
    } else if (!this.altKeyShowed && this.showed && this.active && e.key === 'Alt') {
      e.preventDefault();
      this.elem.addClass('textarena-creator_show-alt-key');
      this.altKeyShowed = true;
    }
    let opts;
    if (this.showed && e.altKey && this.altKeys[e.code]) {
      opts = this.altKeys[e.code];
    } else if (this.showed && ctrlKey && !e.altKey && this.controlKeys[e.code]) {
      opts = this.controlKeys[e.code];
    }
    if (opts) {
      e.preventDefault();
      opts.processor(this.getContext(), opts.config || {});
      this.eventManager.fire('textChanged');
    }
  }

  keyUpListener(): void {
    if (this.altKeyShowed || this.controlKeyShowed) {
      this.elem.removeClass('textarena-creator_show-control-key');
      this.elem.removeClass('textarena-creator_show-alt-key');
      this.controlKeyShowed = false;
      this.altKeyShowed = false;
    }
  }

  getContext(): CreatorContext {
    return {
      focusElement: this.currentFocusElement,
      eventManager: this.eventManager,
      parser: this.parser,
    };
  }

  setOptions(options: CreatorBarOptions): void {
    // TODO use enabler parameter
    if (options.creators) {
      this.list.setInnerHTML('');
      this.creators = options.creators.map((creatorOptions: CreatorOptions | string) => {
        let opts: CreatorOptions;
        if (typeof creatorOptions === 'string') {
          if (creators[creatorOptions]) {
            opts = creators[creatorOptions];
          } else {
            throw Error(`Tool "${creatorOptions}" not found`);
          }
        } else {
          opts = creatorOptions;
        }
        const elem = new ElementHelper('BUTTON', 'textarena-creator__item');
        elem.onClick((e) => {
          e.preventDefault();
          opts.processor(this.getContext(), opts.config || {});
          this.eventManager.fire('textChanged');
        });
        if (opts.icon) {
          elem.setInnerHTML(opts.icon);
        }
        if (opts.controlKey) {
          this.controlKeys[utils.getCodeForKey(opts.controlKey)] = opts;
          const controlKey = new ElementHelper(
            'DIV',
            'textarena-creator__control-key',
            opts.controlKey,
          );
          elem.appendChild(controlKey);
        } else if (opts.altKey) {
          this.altKeys[utils.getCodeForKey(opts.altKey)] = opts;
          const altKey = new ElementHelper(
            'DIV',
            'textarena-creator__alt-key',
            opts.altKey,
          );
          elem.appendChild(altKey);
        }
        this.list.append(elem);
        return {
          elem,
          options: opts,
        };
      });
    }
  }

  getElem(): HTMLElement {
    return this.elem.getElem();
  }

  show(target: HTMLElement): void {
    this.showed = true;
    this.elem.css({
      display: 'flex',
      top: `${target.offsetTop}px`,
    });
    this.closeList();
  }

  hide(): void {
    this.showed = false;
    this.elem.css({
      display: 'none',
    });
    this.closeList();
  }

  openList(): void {
    this.active = true;
    this.elem.addClass('textarena-creator_active');
    if (this.creators.length > 0) {
      this.creators[0].elem.focus();
    }
  }

  closeList(): void {
    this.active = false;
    this.elem.removeClass('textarena-creator_active');
    this.root.focus();
  }

  insertImage(src: string): HTMLElement {
    return utils.insertImage(src, this.getContext());
  }
}
