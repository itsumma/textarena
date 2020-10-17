import creators from "./creators";
import EventManager, { MediaEvent } from "./EventManager";
import CreatorBarOptions from "./interfaces/CreatorBarOptions";
import CreatorContext from "./interfaces/CreatorContext";
import CreatorOptions from "./interfaces/CreatorOptions";

type Creator = {
  elem: HTMLElement;
  options: CreatorOptions;
};

export default class CreatorBar {
  elem: HTMLElement;
  list: HTMLElement;
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
    const placeholder = document.createElement('DIV');
    placeholder.className = 'textarena-creator__placeholder';
    placeholder.innerHTML = 'Введите текст или Ctrl+q';
    this.elem.appendChild(createButton);
    this.elem.appendChild(this.list);
    this.elem.appendChild(placeholder);

    this.eventManager.subscribe('textChanged', () => {
      const focucElement = this.getFocusElement();
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
      this.root.addEventListener("keydown", this.keyDownListenerInstance, false);
      this.elem.addEventListener("keydown", this.keyDownListenerInstance, false);
    });
    this.eventManager.subscribe('turnOff', () => {
      this.root.removeEventListener("keydown", this.keyDownListenerInstance);
      this.elem.removeEventListener("keydown", this.keyDownListenerInstance);
    });
  }

  keyDownListener(e: KeyboardEvent) {
    if (this.showed && !this.active && e.key === 'q' && e.ctrlKey) {
      this.openList();
    }
    if (this.showed && this.active && e.key === 'Escape') {
      this.closeList();
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
      } else {
        if (this.creators.length > 0) {
          this.creators[0].elem.focus();
        }
      }
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
      } else {
        if (this.creators.length > 0) {
          this.creators[this.creators.length - 1].elem.focus();
        }
      }
    }
  }

  getFocusElement(): HTMLElement | undefined {
    const s = window.getSelection();
    if (!s) {
      return undefined;
    }
    const focusNode = s.focusNode;
    if (focusNode) {
      return (focusNode.nodeType === 1 ? focusNode : focusNode.parentElement) as HTMLElement
    }
    return undefined;
  }

  getContext(): CreatorContext {
    return {
      focusElement: this.currentFocusElement,
    };
  }

  setOptions(options: CreatorBarOptions) {
    // TODO use enabler parameter
    if (options.creators) {
      this.list.innerHTML = '';
      this.creators = options.creators.map((creatorOptions: CreatorOptions | string) => {
        let options: CreatorOptions;
        if (typeof creatorOptions === 'string') {
          if (creators[creatorOptions]) {
            options = creators[creatorOptions];
          } else {
            throw `Tool "${creatorOptions}" not found`;
          }
        } else {
          options = creatorOptions;
        }
        const elem = document.createElement('BUTTON');
        elem.className = 'textarena-creator__item';
        elem.onclick = (e) => {
          e.preventDefault();
          options.processor(this.getContext(), options.config || {});
        };
        if (options.icon) {
          elem.innerHTML = options.icon;
        }
        this.list.append(elem);
        return {
          elem,
          options,
        };
      });
    }
  }

  getElem() {
    return this.elem;
  }

  show(target: HTMLElement) {
    this.elem.style.display = 'flex';
    this.elem.style.top = `${target.offsetTop}px`;
    this.showed = true;
    this.active = false;
    this.elem.className = 'textarena-creator';
  }

  hide() {
    this.elem.style.display = 'none';
    this.showed = false;
    this.active = false;
    this.elem.className = 'textarena-creator';
  }

  openList() {
    this.active = true;
    this.elem.className = 'textarena-creator textarena-creator_active';
    if (this.creators.length > 0) {
      this.creators[0].elem.focus();
    }
  }

  closeList() {
    this.active = false;
    this.elem.className = 'textarena-creator';
    this.root.focus();
  }

}
