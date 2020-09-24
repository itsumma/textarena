import creators from "./creators";
import EventManager, { MediaEvent } from "./EventManager";
import CreatorBarOptions from "./interfaces/CreatorBarOptions";
import CreatorContext from "./interfaces/CreatorContext";
import CreatorOptions from "./interfaces/CreatorOptions";

type Creator = {
  elem: Element;
  options: CreatorOptions;
};

export default class CreatorBar {
  elem: HTMLElement;
  list: HTMLElement;
  creators: Creator[] = [];
  showed = false;
  active = false;
  currentFocusElement: HTMLElement | undefined;

  constructor(private root: HTMLElement, private eventManager: EventManager) {
    this.elem = document.createElement('DIV');
    this.elem.className = 'mediatext-creator';
    this.list = document.createElement('DIV');
    this.list.className = 'mediatext-creator__list';
    this.elem.appendChild(this.list);
    this.hide();
    const createButton = document.createElement('BUTTON');
    createButton.className = 'mediatext-creator__create-button';
    createButton.onclick = () => {
      this.active = !this.active;
      this.elem.className = 'mediatext-creator' + (this.active ? ' mediatext-creator_active' : '');
    };
    createButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 14 14">
    <path d="M8.05 5.8h4.625a1.125 1.125 0 0 1 0 2.25H8.05v4.625a1.125 1.125 0 0 1-2.25 0V8.05H1.125a1.125 1.125 0 0 1 0-2.25H5.8V1.125a1.125 1.125 0 0 1 2.25 0V5.8z"/>
    </svg>`;
    this.elem.appendChild(createButton);
    const placeholder = document.createElement('DIV');
    placeholder.className = 'mediatext-creator__placeholder';
    placeholder.innerHTML = '';
    this.elem.appendChild(placeholder);

    this.eventManager.subscribe('changeFocusElement', (event?: string | MediaEvent) => {
      if (typeof event === 'object' && event.target) {
        console.log(event.target)
        if (event.target.textContent === '') {
          this.currentFocusElement = event.target;
          this.show(event.target);
        } else {
          this.currentFocusElement = undefined;
          this.hide();
        }
      }
    });
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
        const elem = document.createElement('DIV');
        elem.className = 'mediatext-creator__item';
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
    this.elem.style.display = 'block';
    this.elem.style.top = `${target.offsetTop}px`;
    this.showed = true;
  }

  hide() {
    this.elem.style.display = 'none';
    this.showed = false;
  }

}
