import creators from './creators';
import EventManager, { MediaEvent } from './EventManager';
import CreatorBarOptions from './interfaces/CreatorBarOptions';
import CreatorContext from './interfaces/CreatorContext';
import CreatorOptions from './interfaces/CreatorOptions';
import { getFocusElement, isMac } from './utils';
import * as utils from './utils';

type Creator = {
  elem: HTMLElement;
  options: CreatorOptions;
};

type KeysForTool = {
  [key: string]: CreatorOptions;
};

export default class CreatorBar {
  elem: HTMLElement;

  list: HTMLElement;

  controlKeys: KeysForTool = {};

  altKeys: KeysForTool = {};

  creators: Creator[] = [];

  showed = false;

  active = false;

  currentFocusElement: HTMLElement | undefined;

  keyDownListenerInstance: ((e: KeyboardEvent) => void);

  constructor(private root: HTMLElement, private eventManager: EventManager) {
    this.elem = document.createElement('DIV');
    this.elem.className = 'textarena-creator';
    this.elem.onclick = () => {
      this.closeList();
    };
    this.list = document.createElement('DIV');
    this.list.className = 'textarena-creator__list';
    this.hide();
    const createButton = document.createElement('BUTTON');
    createButton.className = 'textarena-creator__create-button';
    createButton.onclick = (e: MouseEvent) => {
      e.stopPropagation();
      if (this.active) {
        this.closeList();
      } else {
        this.openList();
      }
    };
    createButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 14 14">
    <path d="M8.05 5.8h4.625a1.125 1.125 0 0 1 0 2.25H8.05v4.625a1.125 1.125 0 0 1-2.25 0V8.05H1.125a1.125 1.125 0 0 1 0-2.25H5.8V1.125a1.125 1.125 0 0 1 2.25 0V5.8z"/>
    </svg>`;
    const MACOS = isMac();
    const altKey = MACOS ? '⌥' : 'Alt';
    const placeholder = document.createElement('DIV');
    placeholder.className = 'textarena-creator__placeholder';
    placeholder.innerHTML = `Введите текст или ${altKey}-Q`;
    this.elem.appendChild(createButton);
    this.elem.appendChild(this.list);
    this.elem.appendChild(placeholder);

    this.eventManager.subscribe('textChanged', () => {
      const focucElement = getFocusElement();
      if (focucElement) {
        if (!focucElement?.textContent) {
          this.currentFocusElement = focucElement;
          this.show(focucElement);
        } else {
          this.currentFocusElement = undefined;
          this.hide();
        }
      }
    });
    this.eventManager.subscribe('changeFocusElement', (event?: string | MediaEvent) => {
      if (typeof event === 'object' && event.target) {
        if (event.target.textContent === '') {
          this.currentFocusElement = event.target;
          this.show(event.target);
        } else {
          this.currentFocusElement = undefined;
          this.hide();
        }
      }
    });
    this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.eventManager.subscribe('turnOn', () => {
      this.root.addEventListener('keydown', this.keyDownListenerInstance, false);
      this.elem.addEventListener('keydown', this.keyDownListenerInstance, false);
    });
    this.eventManager.subscribe('turnOff', () => {
      this.root.removeEventListener('keydown', this.keyDownListenerInstance);
      this.elem.removeEventListener('keydown', this.keyDownListenerInstance);
    });
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
      const activeCreator = this.creators.find((some) => some.elem === document.activeElement);
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
      const activeCreator = this.creators.find((some) => some.elem === document.activeElement);
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
    if (this.showed && e.altKey && this.altKeys[e.code]) {
      e.preventDefault();
      const opts = this.altKeys[e.code];
      opts.processor(this.getContext(), opts.config || {});
    } else if (this.showed && ctrlKey && !e.altKey && this.controlKeys[e.code]) {
      e.preventDefault();
      const opts = this.controlKeys[e.code];
      opts.processor(this.getContext(), opts.config || {});
    }
  }

  getContext(): CreatorContext {
    return {
      focusElement: this.currentFocusElement,
    };
  }

  setOptions(options: CreatorBarOptions): void {
    // TODO use enabler parameter
    if (options.creators) {
      this.list.innerHTML = '';
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
        if (opts.controlKey) {
          this.controlKeys[utils.getCodeForKey(opts.controlKey)] = opts;
        } else if (opts.altKey) {
          this.altKeys[utils.getCodeForKey(opts.altKey)] = opts;
        }
        const elem = document.createElement('BUTTON');
        elem.className = 'textarena-creator__item';
        elem.onclick = (e) => {
          e.preventDefault();
          opts.processor(this.getContext(), opts.config || {});
        };
        if (opts.icon) {
          elem.innerHTML = opts.icon;
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
    return this.elem;
  }

  show(target: HTMLElement): void {
    this.elem.style.display = 'flex';
    this.elem.style.top = `${target.offsetTop}px`;
    this.showed = true;
    this.active = false;
    this.elem.className = 'textarena-creator';
  }

  hide(): void {
    this.elem.style.display = 'none';
    this.showed = false;
    this.active = false;
    this.elem.className = 'textarena-creator';
  }

  openList(): void {
    this.active = true;
    this.elem.className = 'textarena-creator textarena-creator_active';
    if (this.creators.length > 0) {
      this.creators[0].elem.focus();
    }
  }

  closeList(): void {
    this.active = false;
    this.elem.className = 'textarena-creator';
    this.root.focus();
  }

  insertImage(src: string): void {
    return utils.insertImage(src, this.getContext());
  }
}
