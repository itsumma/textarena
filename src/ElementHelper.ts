type CSSStyles = Partial<Omit<CSSStyleDeclaration, 'length'|'parentRule'|'getPropertyPriority'|'getPropertyValue'|'item'|'removeProperty'|'setProperty'>>;

class ElementHelper {
  private elem: HTMLElement;

  private classes: string[] = [];

  constructor(tagName: string) {
    this.elem = document.createElement(tagName);
  }

  addClass(className: string): void {
    if (!this.classes.includes(className)) {
      this.classes.push(className);
      this.elem.className = this.classes.join(' ');
    }
  }

  removeClass(className: string): void {
    const pos = this.classes.indexOf(className);
    if (pos !== -1) {
      this.classes.splice(pos, 1);
      this.elem.className = this.classes.join(' ');
    }
  }

  appendChild(node: Node): Node {
    return this.elem.appendChild(node);
  }

  css(styles: CSSStyles): void {
    const k = 'color';
    this.elem.style[k] = 's';
    Object.entries(styles).forEach(([key, value]) => {
      this.elem.style[key as keyof CSSStyles] = value || '';
    });
  }

  getElem(): HTMLElement {
    return this.elem;
  }
}

export default ElementHelper;
