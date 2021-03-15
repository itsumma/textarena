import Textarena from 'Textarena';
import ArenaSelection from 'ArenaSelection';
import ElementHelper from 'ElementHelper';
import CreatorBarOptions from './interfaces/CreatorBarOptions';
import CreatorOptions from './interfaces/CreatorOptions';

type Creator = {
  elem: ElementHelper;
  options: CreatorOptions;
  modifiers: number;
};

export default class CreatorBar {
  enabled = false;

  elem: ElementHelper;

  list: ElementHelper;

  availableCreators: {
    [key: string]: CreatorOptions,
  } = {};

  creators: Creator[] = [];

  showed = false;

  active = false;

  currentFocusElement: HTMLElement | undefined;

  keyDownListenerInstance: ((e: KeyboardEvent) => void);

  keyUpListenerInstance: ((e: KeyboardEvent) => void);

  constructor(
    private ta: Textarena,
  ) {
    this.elem = new ElementHelper('DIV', 'textarena-creator');
    this.elem.onClick(() => {
      this.closeList();
    });
    this.list = new ElementHelper('DIV', 'textarena-creator__list');
    this.hide();
    const createButton = new ElementHelper('BUTTON', 'textarena-creator__create-button');
    createButton.onClick((e: MouseEvent) => {
      e.stopPropagation();
      if (this.active) {
        this.closeList();
      } else {
        this.openList();
      }
    });
    createButton.setInnerHTML(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 14 14">
    <path d="M8.05 5.8h4.625a1.125 1.125 0 0 1 0 2.25H8.05v4.625a1.125 1.125 0 0 1-2.25 0V8.05H1.125a1.125 1.125 0 0 1 0-2.25H5.8V1.125a1.125 1.125 0 0 1 2.25 0V5.8z"/>
    </svg>`);
    // const MACOS = isMac();
    // const altKey = MACOS ? '⌥' : 'Alt';
    const placeholder = new ElementHelper(
      'DIV',
      'textarena-creator__placeholder',
      // `Введите текст или ${altKey}-Q`,
    );
    this.elem.appendChild(createButton);
    this.elem.appendChild(this.list);
    this.elem.appendChild(placeholder);
    this.ta.container.appendChild(this.getElem());
    this.ta.eventManager.subscribe('moveCursor', () => {
      this.handleChangeSelection();
    });
    this.ta.commandManager.registerCommand(
      'open-creator-list',
      (t, selection: ArenaSelection) => {
        this.openList();
        return selection;
      },
    );
    this.ta.commandManager.registerShortcut('Alt + KeyQ', 'open-creator-list');
    this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.keyUpListenerInstance = this.keyDownListener.bind(this);
    this.ta.eventManager.subscribe('turnOn', () => {
      this.elem.addEventListener('keydown', this.keyDownListenerInstance, false);
      this.elem.addEventListener('keyup', this.keyUpListenerInstance, false);
    });
    this.keyUpListenerInstance = this.keyUpListener.bind(this);
    this.ta.eventManager.subscribe('turnOff', () => {
      this.elem.removeEventListener('keydown', this.keyDownListenerInstance);
      this.elem.removeEventListener('keyup', this.keyUpListenerInstance);
    });
  }

  public setOptions(creatorBarOptions: CreatorBarOptions): void {
    if (creatorBarOptions.creators) {
      this.list.setInnerHTML('');
      this.creators = [];
      creatorBarOptions.creators.forEach((name: string) => {
        if (!this.availableCreators[name]) {
          throw Error(`Creator "${name}" not found`);
        }
        const options = this.availableCreators[name];
        const elem = new ElementHelper('BUTTON', 'textarena-creator__item');
        const [modifiers] = this.ta.commandManager.parseShortcut(options.shortcut);
        elem.onClick((e) => {
          e.preventDefault();
          this.executeTool(options);
        });
        if (options.icon) {
          elem.setInnerHTML(options.icon);
        }
        if (options.hint) {
          const keyElem = new ElementHelper('DIV', 'textarena-creator__hint', options.hint);
          elem.appendChild(keyElem);
        }
        this.list.append(elem);
        this.creators.push({
          elem,
          options,
          modifiers,
        });
      });
    }
    this.enabled = !!creatorBarOptions.enabled;
    if (!this.enabled) {
      this.hide();
    }
  }

  public registerCreator(opts: CreatorOptions): void {
    this.availableCreators[opts.name] = opts;
  }

  private showHints(sum: number): void {
    this.creators.forEach((tool: Creator) => {
      if (tool.modifiers === sum) {
        tool.elem.addClass('textarena-creator__item_show-hint');
      } else {
        tool.elem.removeClass('textarena-creator__item_show-hint');
      }
    });
  }

  handleChangeSelection(): void {
    if (!this.enabled) {
      return;
    }
    const selection = this.ta.view.getCurrentSelection();
    if (selection
      && selection.isCollapsed()
      && selection.startNode.getTextLength() === 0) {
      const target = this.ta.view.findElementById(selection.startNode.getGlobalIndex());
      if (target) {
        this.show(target as HTMLElement);
        return;
      }
    }
    this.hide();
  }

  private keyUpListener(e: KeyboardEvent): void {
    const modifiersSum = this.ta.browser.getModifiersSum(e);
    this.showHints(modifiersSum);
  }

  private keyDownListener(e: KeyboardEvent): void {
    const modifiersSum = this.ta.browser.getModifiersSum(e);
    this.showHints(modifiersSum);
  }

  private executeTool(options: CreatorOptions): void {
    const selection = this.ta.view.getCurrentSelection();
    this.ta.commandManager.execCommand(options.command, selection);
    this.hide();
  }

  getElem(): HTMLElement {
    return this.elem.getElem();
  }

  show(target: HTMLElement): void {
    this.showed = true;
    this.elem.css({
      display: 'flex',
      top: `${target.offsetTop}px`,
    });
    this.closeList();
  }

  hide(): void {
    this.showed = false;
    this.elem.css({
      display: 'none',
    });
    this.closeList();
  }

  openList(): void {
    if (this.showed) {
      this.active = true;
      this.elem.addClass('textarena-creator_active');
      if (this.creators.length > 0) {
        this.creators[0].elem.focus();
      }
    }
  }

  closeList(): void {
    this.active = false;
    this.elem.removeClass('textarena-creator_active');
    this.ta.editor.focus();
  }
}
