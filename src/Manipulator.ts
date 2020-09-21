import ChangeDataListener from "./interfaces/ChangeHandler";
import { isDescendant } from "./utils";

export const emptyStrs = ['<p><br></p>', '<p><br/></p>', '<p></p>'];

export default class Manipulator {
  inputListenerInstance: (() => void);
  mouseUpListenerInstance: (() => void);

  constructor (private elem: HTMLElement, private onChange: () => void) {
    this.inputListenerInstance = this.inputListener.bind(this);
    this.mouseUpListenerInstance = this.mouseUpListener.bind(this);
  }

  turnOn() {
    this.elem.addEventListener("input", this.inputListenerInstance, false);
    this.elem.addEventListener("mouseup", this.mouseUpListenerInstance, false);
  }

  turnOff() {
    this.elem.removeEventListener('input', this.inputListenerInstance);
    this.elem.removeEventListener('mouseup', this.mouseUpListenerInstance);
  }

  inputListener() {
    console.log('fire input');
    this.onChange();
  }

  mouseUpListener() {
    const s = window.getSelection();
    if (s
      && !s.isCollapsed
      && s.anchorNode
      && isDescendant(this.elem, s.anchorNode)
    ) {
      console.log('fire mouseUp');
    }
  }

  checkFirstLine() {
    console.log(this.elem.innerHTML);
    if (this.elem.innerHTML) {
      const firstChild = this.elem.firstChild;
      if (firstChild && firstChild.nodeName === '#text') {
        const newFirstChild = document.createElement('p');
        newFirstChild.append(firstChild.cloneNode());

        const range = document.createRange();
        range.selectNodeContents(this.elem);
        range.setStartAfter(firstChild)

        const children = range.extractContents();
        children.prepend(newFirstChild);

        this.elem.innerHTML = '';
        this.elem.append(children);
      }
    } else {
      console.log(emptyStrs[0]);
      this.elem.innerHTML = emptyStrs[0];
    }
  }
}