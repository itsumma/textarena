import Textarena from 'Textarena';
import { MediaEvent } from 'EventManager';
import { IMAGE_WRAPPER } from 'common/constants';
import ElementHelper from './ElementHelper';
import ToolbarOptions from './interfaces/ToolbarOptions';
import ToolOptions from './interfaces/ToolOptions';
import * as utils from './utils';
import ArenaNode from 'interfaces/ArenaNode';

type Tool = {
  elem: ElementHelper;
  options: ToolOptions;
  modifiers: number;
};

export default class Toolbar {
  enabled = false;

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

  constructor(
    private ta: Textarena,
  ) {
    this.elem = new ElementHelper('DIV', 'textarena-toolbar');
    this.pointer = new ElementHelper('DIV', 'textarena-toolbar__pointer');
    this.list = new ElementHelper('DIV', 'textarena-toolbar__list');
    this.elem.appendChild(this.list);
    this.elem.appendChild(this.pointer);
    this.hide();
    this.ta.eventManager.subscribe('textSelected', () => {
      this.show();
    });
    this.ta.eventManager.subscribe('textUnselected', () => {
      this.hide();
    });
    this.ta.eventManager.subscribe('selectionChanged', () => {
      this.show();
    });
    this.ta.eventManager.subscribe('keyDown', this.keyListener.bind(this));
    this.ta.eventManager.subscribe('keyUp', this.keyListener.bind(this));
    this.ta.container.appendChild(this.getElem());
  }

  public setOptions(toolbarOptions: ToolbarOptions): void {
    if (toolbarOptions.tools) {
      this.list.setInnerHTML('');
      this.tools = toolbarOptions.tools.map((toolOptions: string) => {
        if (!this.availableTools[toolOptions]) {
          throw Error(`Tool "${toolOptions}" not found`);
        }
        const options = this.availableTools[toolOptions];
        const elem = new ElementHelper('DIV', 'textarena-toolbar__item');
        const [modifiers] = this.ta.commandManager.parseShortcut(options.shortcut);
        const tool = {
          elem,
          options,
          modifiers,
        };
        elem.onClick((e) => {
          e.preventDefault();
          this.executeTool(tool);
        });
        if (options.icon) {
          elem.setInnerHTML(options.icon);
        }
        if (options.hint) {
          const keyElem = new ElementHelper('DIV', 'textarena-toolbar__hint', options.hint);
          elem.appendChild(keyElem);
        }
        this.list.appendChild(elem);
        return tool;
      });
    }
    this.enabled = !!toolbarOptions.enabled;
    if (!this.enabled) {
      this.hide();
    }
  }

  public registerTool(opts: ToolOptions): void {
    this.availableTools[opts.name] = opts;
  }

  private keyListener(event?: string | MediaEvent): void {
    if (!this.enabled) {
      return;
    }
    if (typeof event === 'object' && typeof event.data === 'number') {
      this.tools.forEach((tool: Tool) => {
        if (tool.modifiers === event.data) {
          tool.elem.addClass('textarena-toolbar__item_show-hint');
        } else {
          tool.elem.removeClass('textarena-toolbar__item_show-hint');
        }
      });
    }
  }

  private executeTool(tool: Tool): void {
    const { options, elem } = tool;
    const newSelection = this.ta.commandManager.execCommand(options.command);
    this.ta.view.render(newSelection);
    this.hide();
  }

  private updateState() {
    const sel = this.ta.view.getArenaSelection();
    const status: { [key: string]: boolean } = {};
    this.tools.forEach(({ options: { name, checkStatus } }: Tool) => {
      status[name] = !!checkStatus;
    });
    if (sel) {
      this.ta.model.runNodesOfSelection(sel, (node: ArenaNode, start?: number, end?: number) => {
        this.tools.forEach(({ options: { name, checkStatus } }: Tool) => {
          if (status[name]) {
            status[name] = checkStatus(node, start, end);
          }
        });
      });
    }
    this.tools.forEach(({ elem, options: { name } }: Tool) => {
      if (status[name]) {
        elem.addClass('textarena-toolbar__item_active');
      } else {
        elem.removeClass('textarena-toolbar__item_active');
      }
    });
  }

  getElem(): HTMLElement {
    return this.elem.getElem();
  }

  private show(): void {
    if (!this.enabled) {
      return;
    }
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
    const containerRect = this.ta.container.getBoundingClientRect();
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

  private hide(): void {
    this.elem.css({
      display: 'none',
    });
    this.showed = false;
  }
}
