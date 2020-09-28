import EventManager from "./EventManager";
import ToolbarOptions from "./interfaces/ToolbarOptions";
import ToolOptions from "./interfaces/ToolOptions";
import tools from "./tools";


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

type KeysForTool = {
  [key: string]: Tool;
}

export default class Toolbar {
  showed = false;
  controlKeyShowed = false;
  controlKeys: KeysForTool = {};
  altKeys: KeysForTool = {};
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
      this.show();
    });
    this.keyUpListenerInstance = this.keyUpListener.bind(this);
    this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.eventManager.subscribe('turnOn', () => {
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
    console.log(e);
    if (e.altKey && this.altKeys[e.code]) {
      e.preventDefault();
      this.executeTool(this.altKeys[e.code]);
    } else
    if (e.ctrlKey && !e.altKey && this.controlKeys[e.code]) {
      e.preventDefault();
      this.executeTool(this.controlKeys[e.code]);
    } else
    if (!this.controlKeyShowed && this.showed && e.key === 'Control' && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      this.elem.className = 'mediatext-toolbar mediatext-toolbar_show-control-key';
      this.controlKeyShowed = true;
    } else
    if (!this.altKeyShowed && this.showed && e.key === 'Alt') {
      e.preventDefault();
      this.elem.className = 'mediatext-toolbar mediatext-toolbar_show-alt-key';
      this.altKeyShowed = true;
    }
  }

  setOptions(options: ToolbarOptions) {
    // TODO use enabler parameter
    if (options.tools) {
      this.list.innerHTML = '';
      this.controlKeys = {};
      this.tools = options.tools.map((toolOptions: ToolOptions | string) => {
        let options: ToolOptions;
        if (typeof toolOptions === 'string') {
          if (tools[toolOptions]) {
            options = tools[toolOptions];
          } else {
            throw `Tool "${toolOptions}" not found`;
          }
        } else {
          options = toolOptions;
        }
        const elem = document.createElement('DIV');
        elem.className = 'mediatext-toolbar__item';
        const tool = {
          elem,
          options,
        };
        elem.onclick = (e) => {
          e.preventDefault();
          this.executeTool(tool);
        };
        if (options.icon) {
          elem.innerHTML = options.icon;
        }
        if (options.controlKey) {
          this.controlKeys[this.getCodeForKey(options.controlKey)] = tool;
          const controlKey = document.createElement('DIV');
          controlKey.className = 'mediatext-toolbar__control-key';
          controlKey.innerHTML = options.controlKey;
          elem.appendChild(controlKey);
        } else if (options.altKey) {
          this.altKeys[this.getCodeForKey(options.altKey)] = tool;
          const altKey = document.createElement('DIV');
          altKey.className = 'mediatext-toolbar__alt-key';
          altKey.innerHTML = options.altKey;
          elem.appendChild(altKey);
        }
        this.list.append(elem);
        return tool;
      });
      console.log(this.altKeys)
    }
  }

  getCodeForKey(key: string) {
    if (/\d/.test(key)) {
      return 'Digit' + key;
    }
    return 'Key' + key.toUpperCase();
  }

  executeTool(tool: Tool) {
    const { options, elem } = tool;
    options.processor(this, options.config || {});
    if (options.state) {
      if (options.state({}, options.config || {})) {
        elem.className = 'mediatext-toolbar__item mediatext-toolbar__item_active';
      } else {
        elem.className = 'mediatext-toolbar__item';
      }
    }
    this.hide();
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

  hide() {
    this.elem.style.display = 'none';
    this.showed = false;
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

}
