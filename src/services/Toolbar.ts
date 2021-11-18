import ToolbarOptions from '../interfaces/ToolbarOptions';
import ToolOptions from '../interfaces/ToolOptions';
import ElementHelper from '../helpers/ElementHelper';
import ArenaServiceManager from './ArenaServiceManager';
import { AnyArenaNode } from '../interfaces/ArenaNode';
import utils from '../utils';
import ArenaEvent from '../helpers/ArenaEvent';

function getFocusElement(): HTMLElement | undefined {
  const s = window.getSelection();
  if (!s) {
    return undefined;
  }
  const { focusNode } = s;
  if (focusNode) {
    return (focusNode.nodeType === 1 ? focusNode : focusNode.parentElement) as HTMLElement;
  }
  return undefined;
}

type Tool = {
  elem: ElementHelper;
  options: ToolOptions;
  modifiers?: number;
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

  container: ElementHelper;

  constructor(
    protected asm: ArenaServiceManager,
  ) {
    this.elem = new ElementHelper('DIV', 'textarena-toolbar');
    this.pointer = new ElementHelper('DIV', 'textarena-toolbar__pointer');
    this.list = new ElementHelper('DIV', 'textarena-toolbar__list');
    this.elem.appendChild(this.list);
    this.elem.appendChild(this.pointer);
    this.hide();
    this.asm.eventManager.subscribe('textSelected', () => {
      this.show();
    });
    this.asm.eventManager.subscribe('textUnselected', () => {
      this.hide();
    });
    this.asm.eventManager.subscribe('selectionChanged', () => {
      this.show();
    });
    this.asm.eventManager.subscribe('keyDown', this.keyListener.bind(this));
    this.asm.eventManager.subscribe('keyUp', this.keyListener.bind(this));
    this.container = this.asm.textarena.getContainerElement();
    this.container.appendChild(this.getElem());
  }

  public setOptions(toolbarOptions: ToolbarOptions): void {
    if (toolbarOptions.tools) {
      this.list.setInnerHTML('');
      this.tools = toolbarOptions.tools.map((toolOptions: string) => {
        if (!this.availableTools[toolOptions]) {
          throw Error(`Tool "${toolOptions}" not found`);
        }
        const options = this.availableTools[toolOptions];
        const elem = new ElementHelper('BUTTON', 'textarena-toolbar__item');
        elem.setAttribute('type', 'button');
        // if (options.title) {
        //   elem.setAttribute('title', options.title);
        // }
        const tool: Tool = {
          elem,
          options,
        };
        if (options.shortcut) {
          const [modifiers, key] = this.asm.commandManager.parseShortcut(options.shortcut);
          tool.modifiers = modifiers;
          if (key) {
            const humanShortcut = this.asm.commandManager.getHumanShortcut(options.shortcut);
            const hint = this.asm.commandManager.getHumanKey(key);
            const shortHintElem = new ElementHelper('DIV', 'textarena-shortcut-hint-short', hint);
            const fullHintElem = new ElementHelper(
              'DIV',
              'textarena-shortcut-hint-full',
              `${options.title}<i>${humanShortcut}</i>`,
            );
            elem.appendChild(shortHintElem);
            elem.appendChild(fullHintElem);
          }
        }
        elem.onClick((e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          this.executeTool(tool);
        });
        if (options.icon) {
          const span = new ElementHelper('DIV', `textarena-toolbar__item-icon ${options.cls}`, options.icon);
          elem.appendChild(span);
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

  private keyListener(event: ArenaEvent): void {
    if (!this.enabled || !this.showed) {
      return;
    }
    if (typeof event === 'object' && typeof event.detail === 'number') {
      this.tools.forEach((tool: Tool) => {
        if (tool.modifiers && tool.modifiers === event.detail) {
          tool.elem.addClass('textarena-toolbar__item_show-hint');
        } else {
          tool.elem.removeClass('textarena-toolbar__item_show-hint');
        }
      });
    }
  }

  private executeTool(tool: Tool): void {
    const { options } = tool;
    const selection = this.asm.view.getCurrentSelection();
    this.asm.commandManager.execCommand(options.command, selection);
    this.hide();
  }

  private updateState() {
    const sel = this.asm.view.getCurrentSelection();
    const status: { [key: string]: boolean | undefined } = {};
    this.tools.forEach(({ options: { name } }: Tool) => {
      status[name] = undefined;
    });
    if (sel) {
      utils.modelTree.runThroughSelection(
        sel,
        (node: AnyArenaNode, start?: number, end?: number) => {
          this.tools.forEach(({ options: { name, checkStatus } }: Tool) => {
            if (status[name] === undefined || status[name] === true) {
              const result = checkStatus ? checkStatus(node, start, end) : false;
              if (typeof result === 'boolean') {
                status[name] = result;
              }
            }
          });
        },
      );
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
    const focusElement = getFocusElement();
    if (!focusElement) {
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

  private hide(): void {
    this.elem.css({
      display: 'none',
    });
    this.tools.forEach((tool: Tool) => {
      tool.elem.removeClass('textarena-toolbar__item_show-hint');
    });
    this.showed = false;
  }
}
