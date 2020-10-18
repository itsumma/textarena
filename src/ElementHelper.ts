type CSSStyles = Partial<Omit<CSSStyleDeclaration, 'length'|'parentRule'|'getPropertyPriority'|'getPropertyValue'|'item'|'removeProperty'|'setProperty'>>;

class ElementHelper {
  private elem: HTMLElement;

  private classes: string[] = [];

  constructor(tagName: string) {
    this.elem = document.createElement(tagName);
  }

  addClass(className: string): ElementHelper {
    if (!this.classes.includes(className)) {
      this.classes.push(className);
      this.elem.className = this.classes.join(' ');
    }
    return this;
  }

  removeClass(className: string): ElementHelper {
    const pos = this.classes.indexOf(className);
    if (pos !== -1) {
      this.classes.splice(pos, 1);
      this.elem.className = this.classes.join(' ');
    }
    return this;
  }

  appendChild(node: Node | ElementHelper): ElementHelper {
    this.elem.appendChild(node instanceof ElementHelper ? node.getElem() : node);
    return this;
  }

  css(styles: CSSStyles): ElementHelper {
    const k = 'color';
    this.elem.style[k] = 's';
    Object.entries(styles).forEach(([key, value]) => {
      this.elem.style[key as keyof CSSStyles] = value || '';
    });
    return this;
  }

  getElem(): HTMLElement {
    return this.elem;
  }

  setInnerHTML(html: string): ElementHelper {
    this.elem.innerHTML = html;
    return this;
  }

  onClick(handler: ((this: GlobalEventHandlers, ev: MouseEvent) => void) | null): ElementHelper {
    this.elem.onclick = handler;
    return this;
  }
}

export default ElementHelper;
