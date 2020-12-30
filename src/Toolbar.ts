import { IMAGE_WRAPPER } from 'common/constants';
import ElementHelper from './ElementHelper';
import EventManager from './EventManager';
import ToolbarOptions from './interfaces/ToolbarOptions';
import ToolOptions from './interfaces/ToolOptions';
import tools from './tools';
import * as utils from './utils';
import { isMac } from './utils';

type Tool = {
  elem: ElementHelper;
  options: ToolOptions;
};

type KeysForTool = {
  [key: string]: Tool;
};

export default class Toolbar {
  showed = false;

  controlKeyShowed = false;

  controlKeys: KeysForTool = {};

  altKeys: KeysForTool = {};

  altKeyShowed = false;

  elem: ElementHelper;

  list: ElementHelper;

  pointer: ElementHelper;

  tools: Tool[] = [];

  leftPadding = 15;

  rightPadding = 30;

  keyUpListenerInstance: ((e: KeyboardEvent) => void);

  keyDownListenerInstance: ((e: KeyboardEvent) => void);

  constructor(
    private container: HTMLElement,
    private root: HTMLElement,
    private eventManager: EventManager,
  ) {
    this.elem = new ElementHelper('DIV');
    this.elem.addClass('textarena-toolbar');
    this.pointer = new ElementHelper('DIV');
    this.pointer.addClass('textarena-toolbar__pointer');
    this.list = new ElementHelper('DIV');
    this.list.addClass('textarena-toolbar__list');
    this.elem.appendChild(this.list);
    this.elem.appendChild(this.pointer);
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

  keyUpListener(): void {
    if (this.altKeyShowed || this.controlKeyShowed) {
      this.elem.removeClass('textarena-toolbar_show-control-key');
      this.elem.removeClass('textarena-toolbar_show-alt-key');
      this.controlKeyShowed = false;
      this.altKeyShowed = false;
    }
  }

  keyDownListener(e: KeyboardEvent): void {
    const MACOS = isMac();
    const ctrlKey = MACOS ? e.metaKey : e.ctrlKey;
    const key = MACOS ? 'Meta' : 'Control';
    if (e.code === 'Tab' && !e.altKey && !ctrlKey) {
      const el = utils.getFocusElement();
      if (utils.isElementParent(el, ['UL', 'OL'], 3)) return;
      e.preventDefault();
      document.execCommand('indent');
    }
    if (e.altKey && this.altKeys[e.code]) {
      e.preventDefault();
      this.executeTool(this.altKeys[e.code]);
    } else
    if (ctrlKey && !e.altKey && this.controlKeys[e.code]) {
      e.preventDefault();
      this.executeTool(this.controlKeys[e.code]);
    } else
    if (!this.controlKeyShowed && this.showed && e.key === key && !e.altKey && !e.shiftKey) {
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

  setOptions(toolbarOptions: ToolbarOptions): void {
    // TODO use enabler parameter
    if (toolbarOptions.tools) {
      this.list.setInnerHTML('');
      this.controlKeys = {};
      this.tools = toolbarOptions.tools.map((toolOptions: ToolOptions | string) => {
        let options: ToolOptions;
        if (typeof toolOptions === 'string') {
          if (tools[toolOptions]) {
            options = tools[toolOptions];
          } else {
            throw Error(`Tool "${toolOptions}" not found`);
          }
        } else {
          options = toolOptions;
        }
        const elem = new ElementHelper('DIV');
        elem.addClass('textarena-toolbar__item');
        const tool = {
          elem,
          options,
        };
        elem.onClick((e) => {
          e.preventDefault();
          this.executeTool(tool);
        });
        if (options.icon) {
          elem.setInnerHTML(options.icon);
        }
        if (options.controlKey) {
          this.controlKeys[utils.getCodeForKey(options.controlKey)] = tool;
          const controlKey = document.createElement('DIV');
          controlKey.className = 'textarena-toolbar__control-key';
          controlKey.innerHTML = options.controlKey;
          elem.appendChild(controlKey);
        } else if (options.altKey) {
          this.altKeys[utils.getCodeForKey(options.altKey)] = tool;
          const altKey = document.createElement('DIV');
          altKey.className = 'textarena-toolbar__alt-key';
          altKey.innerHTML = options.altKey;
          elem.appendChild(altKey);
        }
        this.list.appendChild(elem);
        return tool;
      });
    }
  }

  executeTool(tool: Tool): void {
    const { options, elem } = tool;
    options.processor(this, options.config || {});
    if (options.state) {
      if (options.state({}, options.config || {})) {
        elem.addClass('textarena-toolbar__item_active');
      } else {
        elem.removeClass('textarena-toolbar__item_active');
      }
    }
    this.hide();
  }

  private updateState() {
    this.tools.forEach((tool: Tool) => {
      const { options, elem } = tool;
      if (!options.state) {
        return;
      }
      if (options.state({}, options.config || {})) {
        elem.addClass('textarena-toolbar__item_active');
      } else {
        elem.removeClass('textarena-toolbar__item_active');
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
    const focusElement = utils.getFocusElement();
    if (!focusElement || focusElement.tagName === IMAGE_WRAPPER) {
      return;
    }
    const rootElement = focusElement.closest('.textarena-editor');
    if (!rootElement) {
      return;
    }
    const range = s.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    let positionTop = true;
    if (rect.y < window.innerHeight / 2) {
      positionTop = rect.top >= window.innerHeight - rect.bottom;
    }
    if (positionTop) {
      let elemBottom = containerRect.bottom - rect.top;
      if (rect.top < 100) {
        elemBottom -= 100;
      }
      this.elem.css({
        top: 'auto',
        bottom: `${elemBottom}px`,
      });
      this.elem.removeClass('textarena-toolbar_bottom');
      this.elem.addClass('textarena-toolbar_top');
    } else {
      let elemTop = rect.top - containerRect.top + rect.height;
      if (window.innerHeight - rect.bottom < 100) {
        elemTop -= 100;
      }
      this.elem.css({
        top: `${elemTop}px`,
        bottom: 'auto',
      });
      this.elem.removeClass('textarena-toolbar_top');
      this.elem.addClass('textarena-toolbar_bottom');
    }
    this.list.css({
      marginLeft: '0',
    });
    this.elem.css({
      left: `${this.leftPadding - containerRect.left}px`,
      right: `${containerRect.right - window.innerWidth + this.rightPadding}px`,
      display: 'flex',
      visibility: 'hidden',
    });
    const centerPosition = (rect.left + rect.right) / 2;
    const elemWidth = this.elem.getElem().offsetWidth;
    const listWidth = this.list.getElem().offsetWidth;
    const listLeft = Math.max(
      0,
      Math.min(
        elemWidth - listWidth,
        centerPosition - this.leftPadding - listWidth / 2,
      ),
    );
    this.list.css({
      marginLeft: `${listLeft}px`,
    });
    const pointerLeft = Math.max(
      15,
      Math.min(
        elemWidth,
        centerPosition - this.leftPadding - 8,
      ),
    );
    this.pointer.css({
      left: `${pointerLeft}px`,
    });
    this.updateState();
    this.elem.css({
      visibility: 'visible',
    });
    this.showed = true;
  }

  hide(): void {
    this.elem.css({
      display: 'none',
    });
    this.showed = false;
  }
}
