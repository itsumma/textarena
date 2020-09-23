import EventManager from "./EventManager";
import ToolbarOptions from "./interfaces/ToolbarOptions";
import ToolOptions from "./interfaces/ToolOptions";
import ToolProcessor from "./interfaces/ToolProcessor";
import toolbarTools from "./toolbarTools";


const scrollPattern = /(auto|scroll)/

const style = (node: Element, prop: string) => (
	getComputedStyle(node, null).getPropertyValue(prop)
)

const scroll = (node: Element) =>
	scrollPattern.test(
		style(node, 'overflow') +
		style(node, 'overflow-y') +
		style(node, 'overflow-x')
	);

const getScrollparent = (node: Element | null): Node =>
	!node || node === document.body
	? document.body
	: scroll(node)
		? node
		: getScrollparent(node.parentElement);


type Tool = {
  elem: Element;
  options: ToolOptions;
};

export default class Toolbar {
  showed = false;
  controlKeyShowed = false;
  altKeyShowed = false;
  elem: HTMLElement;
  list: HTMLElement;
  tools: Tool[] = [];
  keyUpListenerInstance: ((e: KeyboardEvent) => void);
  keyDownListenerInstance: ((e: KeyboardEvent) => void);

  constructor(private root: HTMLElement, private eventManager: EventManager) {
    this.elem = document.createElement('DIV');
    this.elem.className = 'mediatext-toolbar';
    this.list = document.createElement('DIV');
    this.list.className = 'mediatext-toolbar__list';
    this.elem.appendChild(this.list);
    this.hide();
    this.eventManager.subscribe('textSelected', () => {
      this.show();
    });
    this.eventManager.subscribe('textUnselected', () => {
      this.hide();
    });
    this.eventManager.subscribe('selectionChanged', () => {
      this.move();
    });
    this.keyUpListenerInstance = this.keyUpListener.bind(this);
    this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.eventManager.subscribe('turnOn', () => {
      console.log('tool')
      this.root.addEventListener("keyup", this.keyUpListenerInstance, false);
      this.root.addEventListener("keydown", this.keyDownListenerInstance, false);
    });
    this.eventManager.subscribe('turnOff', () => {
      this.root.removeEventListener("keyup", this.keyUpListenerInstance);
      this.root.removeEventListener("keydown", this.keyDownListenerInstance);
    });
  }

  keyUpListener(e: KeyboardEvent) {
    if (this.altKeyShowed || this.controlKeyShowed) {
      this.elem.className = 'mediatext-toolbar';
      this.controlKeyShowed = false;
      this.altKeyShowed = false;
    }
  }

  keyDownListener(e: KeyboardEvent) {
    if (!this.controlKeyShowed && this.showed && e.key === 'Control') {
      this.elem.className = 'mediatext-toolbar mediatext-toolbar_show-control-key';
      this.controlKeyShowed = true;
    }
    if (!this.altKeyShowed && this.showed && e.key === 'Alt') {
      this.elem.className = 'mediatext-toolbar mediatext-toolbar_show-alt-key';
      this.altKeyShowed = true;
    }
  }

  setOptions(options: ToolbarOptions) {
    // TODO use enabler parameter
    if (options.tools) {
      this.list.innerHTML = '';
      this.tools = options.tools.map((toolOptions: ToolOptions | string) => {
        let options: ToolOptions;
        if (typeof toolOptions === 'string') {
          if (toolbarTools[toolOptions]) {
            options = toolbarTools[toolOptions];
          } else {
            throw `Tool "${toolOptions}" not found`;
          }
        } else {
          options = toolOptions;
        }
        const elem = document.createElement('DIV');
        elem.className = 'mediatext-toolbar__item';
        elem.onclick = (e) => {
          e.preventDefault();
          options.processor(this.getContext, options.config || {});
          if (options.state) {
            if (options.state({}, options.config || {})) {
              elem.className = 'mediatext-toolbar__item mediatext-toolbar__item_active';
            } else {
              elem.className = 'mediatext-toolbar__item';
            }
          }
        };
        if (options.icon) {
          elem.innerHTML = options.icon;
        }
        if (options.controlKey) {
          console.log(options);
          const controlKey = document.createElement('DIV');
          controlKey.className = 'mediatext-toolbar__control-key';
          controlKey.innerHTML = options.controlKey;
          elem.appendChild(controlKey);
        } else if (options.altKey) {
          console.log(options);
          const altKey = document.createElement('DIV');
          altKey.className = 'mediatext-toolbar__alt-key';
          altKey.innerHTML = options.altKey;
          elem.appendChild(altKey);
        }
        this.list.append(elem);
        return {
          elem,
          options,
        };
      });
    }
  }

  private updateState() {
    this.tools.forEach((tool: Tool) => {
      if (!tool.options.state) {
        return;
      }
      if (tool.options.state({}, tool.options.config || {})) {
        tool.elem.className = 'mediatext-toolbar__item mediatext-toolbar__item_active';
      } else {
        tool.elem.className = 'mediatext-toolbar__item';
      }
    });
  }

  getElem() {
    return this.elem;
  }

  private getContext() {
    return {};
  }

  show() {
    const s = window.getSelection()
    if (s && !s.isCollapsed && s.rangeCount > 0) {
        const  range = s.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        const elemSel = range.startContainer.parentElement;
        if (elemSel) {
          let scrollparent = getScrollparent(elemSel) as HTMLElement
          let scrollTop = scrollparent.tagName === 'BODY' ? window.pageYOffset : scrollparent.scrollTop
          rect.y += scrollTop
          this.elem.style.top = `${rect.y + rect.height}px`;
          this.elem.style.left = `${rect.x + rect.width / 2}px`;
          this.updateState();
          this.elem.style.display = 'block';
          this.showed = true;
        }
    }
  }

  move() {
    const s = window.getSelection()
    if (s && !s.isCollapsed && s.rangeCount > 0) {
        const range = s.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        const elemSel = range.startContainer.parentElement;
        if (elemSel) {
          let scrollparent = getScrollparent(elemSel) as HTMLElement
          let scrollTop = scrollparent.tagName === 'BODY' ? window.pageYOffset : scrollparent.scrollTop
          rect.y += scrollTop
          this.elem.style.top = `${rect.y + rect.height}px`;
          this.elem.style.left = `${rect.x + rect.width / 2}px`;
          this.updateState();
        }
    }
  }

  hide() {
    this.elem.style.display = 'none';
    this.showed = false;
  }

}
