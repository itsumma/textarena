type CSSStyles = Partial<Omit<CSSStyleDeclaration, 'length'|'parentRule'|'getPropertyPriority'|'getPropertyValue'|'item'|'removeProperty'|'setProperty'>>;

class ElementHelper {
  private elem: HTMLElement;

  private classes: string[] = [];

  private observer: MutationObserver | undefined;

  constructor(tagName: string | HTMLElement, className = '', innerHtml = '') {
    if (typeof tagName === 'string') {
      this.elem = document.createElement(tagName);
    } else {
      this.elem = tagName;
    }
    if (className) {
      this.setClass(className);
    }
    if (innerHtml) {
      this.setInnerHTML(innerHtml);
    }
  }

  setClass(className: string): ElementHelper {
    this.elem.className = className;
    this.classes = [className];
    return this;
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

  append(node: Node | ElementHelper): ElementHelper {
    this.elem.append(node instanceof ElementHelper ? node.getElem() : node);
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

  getInnerHTML(): string {
    return this.elem.innerHTML;
  }

  setInnerHTML(html: string): ElementHelper {
    this.elem.innerHTML = html;
    return this;
  }

  setContentEditable(enable: boolean): ElementHelper {
    this.elem.contentEditable = enable ? 'true' : 'false';
    return this;
  }

  onClick(handler: ((this: GlobalEventHandlers, ev: MouseEvent) => void) | null): ElementHelper {
    this.elem.onclick = handler;
    return this;
  }

  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) : ElementHelper {
    this.elem.addEventListener(type, listener, options);
    return this;
  }

  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ) : ElementHelper {
    this.elem.removeEventListener(type, listener, options);
    return this;
  }

  getBoundingClientRect(): DOMRect {
    return this.elem.getBoundingClientRect();
  }

  focus(): ElementHelper {
    this.elem.focus();
    return this;
  }

  startObserve(callback: MutationCallback, options?: MutationObserverInit): void {
    this.stopObserve();
    this.observer = new MutationObserver(callback);
    this.observer.observe(this.elem, options);
  }

  stopObserve(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }
}

export default ElementHelper;
