import ElementHelper from './ElementHelper';
import EventManager from './EventManager';
import ToolbarOptions from './interfaces/ToolbarOptions';
import ToolOptions from './interfaces/ToolOptions';
import tools from './tools';

const scrollPattern = /(auto|scroll)/;

const style = (node: Element, prop: string): string => (
  getComputedStyle(node, null).getPropertyValue(prop)
);

const scroll = (node: Element) => scrollPattern.test(
  style(node, 'overflow')
  + style(node, 'overflow-y')
  + style(node, 'overflow-x'),
);

const getScrollableParent = (node: Element | null): Element => {
  if (!node || node === document.body) {
    return document.body;
  }
  return scroll(node)
    ? node
    : getScrollableParent(node.parentElement);
};

const getCodeForKey = (key: string): string => {
  if (/\d/.test(key)) {
    return `Digit${key}`;
  }
  return `Key${key.toUpperCase()}`;
};

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

  elem: ElementHelper;

  list: HTMLElement;

  tools: Tool[] = [];

  keyUpListenerInstance: ((e: KeyboardEvent) => void);

  keyDownListenerInstance: ((e: KeyboardEvent) => void);

  constructor(
    private container: HTMLElement,
    private root: HTMLElement,
    private eventManager: EventManager,
  ) {
    this.elem = new ElementHelper('DIV');
    this.elem.addClass('textarena-toolbar');
    this.list = document.createElement('DIV');
    this.list.className = 'textarena-toolbar__list';
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
      this.root.addEventListener('keyup', this.keyUpListenerInstance, false);
      this.root.addEventListener('keydown', this.keyDownListenerInstance, false);
    });
    this.eventManager.subscribe('turnOff', () => {
      this.root.removeEventListener('keyup', this.keyUpListenerInstance);
      this.root.removeEventListener('keydown', this.keyDownListenerInstance);
    });
  }

  keyUpListener(e: KeyboardEvent): void {
    if (this.altKeyShowed || this.controlKeyShowed) {
      this.elem.removeClass('textarena-toolbar_show-control-key');
      this.elem.removeClass('textarena-toolbar_show-alt-key');
      this.controlKeyShowed = false;
      this.altKeyShowed = false;
    }
  }

  keyDownListener(e: KeyboardEvent): void {
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
      this.elem.addClass('textarena-toolbar_show-control-key');
      this.controlKeyShowed = true;
    } else
    if (!this.altKeyShowed && this.showed && e.key === 'Alt') {
      e.preventDefault();
      this.elem.addClass('textarena-toolbar_show-alt-key');
      this.altKeyShowed = true;
    }
  }

  setOptions(toolbarOptions: ToolbarOptions) {
    // TODO use enabler parameter
    if (toolbarOptions.tools) {
      this.list.innerHTML = '';
      this.controlKeys = {};
      this.tools = toolbarOptions.tools.map((toolOptions: ToolOptions | string) => {
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
        elem.className = 'textarena-toolbar__item';
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
          this.controlKeys[getCodeForKey(options.controlKey)] = tool;
          const controlKey = document.createElement('DIV');
          controlKey.className = 'textarena-toolbar__control-key';
          controlKey.innerHTML = options.controlKey;
          elem.appendChild(controlKey);
        } else if (options.altKey) {
          this.altKeys[getCodeForKey(options.altKey)] = tool;
          const altKey = document.createElement('DIV');
          altKey.className = 'textarena-toolbar__alt-key';
          altKey.innerHTML = options.altKey;
          elem.appendChild(altKey);
        }
        this.list.append(elem);
        return tool;
      });
      console.log(this.altKeys);
    }
  }

  executeTool(tool: Tool) {
    const { options, elem } = tool;
    options.processor(this, options.config || {});
    if (options.state) {
      if (options.state({}, options.config || {})) {
        elem.className = 'textarena-toolbar__item textarena-toolbar__item_active';
      } else {
        elem.className = 'textarena-toolbar__item';
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
        tool.elem.className = 'textarena-toolbar__item textarena-toolbar__item_active';
      } else {
        tool.elem.className = 'textarena-toolbar__item';
      }
    });
  }

  getElem(): HTMLElement {
    return this.elem.getElem();
  }

  show(): void {
    const s = window.getSelection();
    if (!s || s.isCollapsed || s.rangeCount === 0) {
      return;
    }
    const { focusNode } = s;
    if (!focusNode) {
      return;
    }
    const focusElement = (focusNode.nodeType === 1
      ? focusNode : focusNode.parentElement) as HTMLElement;
    const rootElement = focusElement.closest('.textarena-editor');
    if (!rootElement) {
      return;
    }
    const range = s.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    let positionTop = true;
    if (rect.y < 400) {
      positionTop = rect.y >= window.innerHeight / 2;
    }
    if (positionTop) {
      this.elem.css({
        top: 'auto',
        bottom: `${containerRect.bottom - rect.top}px`,
      });
      this.elem.removeClass('textarena-toolbar_bottom');
      this.elem.addClass('textarena-toolbar_top');
    } else {
      this.elem.css({
        top: `${rect.y - containerRect.y + rect.height}px`,
        bottom: 'auto',
      });
      this.elem.removeClass('textarena-toolbar_top');
      this.elem.addClass('textarena-toolbar_bottom');
    }
    this.elem.css({
      left: `${rect.x + rect.width / 2}px`,
      display: 'block',
    });
    this.updateState();
    this.showed = true;
  }

  hide(): void {
    this.elem.css({
      display: 'none',
    });
    this.showed = false;
  }

}
