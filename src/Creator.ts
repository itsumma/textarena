import EventManager, { MediaEvent } from "./EventManager";
import plusIcon from './icons/plus.svg';


export default class Creator {
  elem: HTMLElement;
  showed = false;

  constructor(private root: HTMLElement, private eventManager: EventManager) {
    this.elem = document.createElement('DIV');
    this.elem.className = 'mediatext-creator';
    this.hide();
    const createButton = document.createElement('BUTTON');
    createButton.className = 'mediatext-creator__create-button';
    createButton.onclick = () => {
      console.log('create')
    };
    createButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 14 14">
    <path d="M8.05 5.8h4.625a1.125 1.125 0 0 1 0 2.25H8.05v4.625a1.125 1.125 0 0 1-2.25 0V8.05H1.125a1.125 1.125 0 0 1 0-2.25H5.8V1.125a1.125 1.125 0 0 1 2.25 0V5.8z"/>
    </svg>`;
    this.elem.appendChild(createButton);
    const placeholder = document.createElement('DIV');
    placeholder.className = 'mediatext-creator__placeholder';
    placeholder.innerHTML = 'Введите текст ...';
    this.elem.appendChild(placeholder);

    this.eventManager.subscribe('changeFocusElement', (event?: string | MediaEvent) => {
      if (typeof event === 'object' && event.target) {
        console.log(event.target)
        if (event.target.textContent === '') {
          this.show(event.target);
        } else {
          this.hide();
        }
      }
    });
  }

  getElem() {
    return this.elem;
  }

  show(target: Element) {
    this.elem.style.display = 'block';
    this.elem.style.top = `${target.offsetTop}px`;
    this.showed = true;
  }

  hide() {
    this.elem.style.display = 'none';
    this.showed = false;
  }

}
