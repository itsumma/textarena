import Textarena from 'Textarena';
import { IMAGE_WRAPPER } from 'common/constants';
import ElementHelper from './ElementHelper';
import ToolbarOptions from './interfaces/ToolbarOptions';
import ToolOptions from './interfaces/ToolOptions';
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

  altKeyShowed = false;

  elem: ElementHelper;

  list: ElementHelper;

  pointer: ElementHelper;

  availableTools: {
    [key: string]: ToolOptions,
  } = {};

  tools: Tool[] = [];

  leftPadding = 15;

  rightPadding = 30;

  keyUpListenerInstance: ((e: KeyboardEvent) => void);

  keyDownListenerInstance: ((e: KeyboardEvent) => void);

  constructor(
    private textarena: Textarena,
  ) {
    this.elem = new ElementHelper('DIV', 'textarena-toolbar');
    this.pointer = new ElementHelper('DIV', 'textarena-toolbar__pointer');
    this.list = new ElementHelper('DIV', 'textarena-toolbar__list');
    this.elem.appendChild(this.list);
    this.elem.appendChild(this.pointer);
    this.hide();
    this.textarena.eventManager.subscribe('textSelected', () => {
      this.show();
    });
    this.textarena.eventManager.subscribe('textUnselected', () => {
      this.hide();
    });
    this.textarena.eventManager.subscribe('selectionChanged', () => {
      this.show();
    });
    this.keyUpListenerInstance = this.keyUpListener.bind(this);
    this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.textarena.eventManager.subscribe('turnOn', () => {
      this.textarena.editor.addEventListener('keyup', this.keyUpListenerInstance, false);
      this.textarena.editor.addEventListener('keydown', this.keyDownListenerInstance, false);
    });
    this.textarena.eventManager.subscribe('turnOff', () => {
      this.textarena.editor.removeEventListener('keyup', this.keyUpListenerInstance);
      this.textarena.editor.removeEventListener('keydown', this.keyDownListenerInstance);
    });
    this.textarena.container.appendChild(this.getElem());
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
    if (!this.controlKeyShowed && this.showed && e.key === key && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      this.elem.addClass('textarena-toolbar_show-control-key');
      this.controlKeyShowed = true;
    } else if (!this.altKeyShowed && this.showed && e.key === 'Alt') {
      e.preventDefault();
      this.elem.addClass('textarena-toolbar_show-alt-key');
      this.altKeyShowed = true;
    }
  }

  setOptions(toolbarOptions: ToolbarOptions): void {
    // TODO use enabler parameter
    if (toolbarOptions.tools) {
      this.list.setInnerHTML('');
      this.tools = toolbarOptions.tools.map((toolOptions: string) => {
        if (!this.availableTools[toolOptions]) {
          throw Error(`Tool "${toolOptions}" not found`);
        }
        const options = this.availableTools[toolOptions];
        const elem = new ElementHelper('DIV', 'textarena-toolbar__item');
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
          const controlKey = new ElementHelper('DIV', 'textarena-toolbar__control-key', options.controlKey);
          elem.appendChild(controlKey);
        } else if (options.altKey) {
          const altKey = new ElementHelper('DIV', 'textarena-toolbar__alt-key', options.altKey);
          elem.appendChild(altKey);
        }
        this.list.appendChild(elem);
        return tool;
      });
    }
  }

  registerTool(opts: ToolOptions): void {
    this.availableTools[opts.name] = opts;
  }

  executeTool(tool: Tool): void {
    const { options, elem } = tool;
    this.textarena.commandManager.execCommand(options.command);
    this.textarena.view.render();
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
    const containerRect = this.textarena.container.getBoundingClientRect();
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
