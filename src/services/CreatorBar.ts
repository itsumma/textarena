import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ElementHelper from '../helpers/ElementHelper';
import CreatorBarOptions from '../interfaces/CreatorBarOptions';
import CreatorOptions from '../interfaces/CreatorOptions';
import ArenaServiceManager from './ArenaServiceManager';
import { AnyArenaNode } from '../interfaces/ArenaNode';

type Creator = {
  elem: ElementHelper;
  options: CreatorOptions;
  modifiers?: number;
  show: boolean;
};

export default class CreatorBar {
  enabled = false;

  elem: ElementHelper;

  list: ElementHelper;

  buttonWrapper: ElementHelper;

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
    private asm: ArenaServiceManager,
  ) {
    this.elem = new ElementHelper('ARENA-CREATOR', 'textarena-creator');
    this.elem.setContentEditable(false);
    this.elem.onClick(() => {
      this.closeList();
      this.asm.textarena.getEditorElement().focus();
    });
    this.list = new ElementHelper('DIV', 'textarena-creator__list');
    this.hide();
    const createButton = new ElementHelper('BUTTON', 'textarena-creator__create-button');
    createButton.onClick((e: MouseEvent) => {
      e.stopPropagation();
      if (this.active) {
        this.closeList();
        this.asm.textarena.getEditorElement().focus();
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
    this.buttonWrapper = new ElementHelper('DIV', 'textarena-creator__create-button-wrapper');
    this.buttonWrapper.appendChild(createButton);
    this.elem.appendChild(this.buttonWrapper);
    this.elem.appendChild(this.list);
    this.elem.appendChild(placeholder);
    this.asm.textarena.getContainerElement().appendChild(this.getElem());
    this.asm.eventManager.subscribe('moveCursor', () => {
      this.handleChangeSelection();
    });
    this.asm.commandManager.registerCommand(
      'open-creator-list',
      (_t: Textarena, selection: ArenaSelection) => {
        this.openList();
        return selection;
      },
    );
    this.asm.commandManager.registerShortcut('Alt + KeyQ', 'open-creator-list');
    this.keyDownListenerInstance = this.keyDownListener.bind(this);
    this.keyUpListenerInstance = this.keyDownListener.bind(this);
    this.asm.eventManager.subscribe('turnOn', () => {
      this.elem.addEventListener('keydown', this.keyDownListenerInstance, false);
      this.elem.addEventListener('keyup', this.keyUpListenerInstance, false);
    });
    this.keyUpListenerInstance = this.keyUpListener.bind(this);
    this.asm.eventManager.subscribe('turnOff', () => {
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
        const creator: Creator = {
          elem,
          options,
          show: true,
        };
        if (options.shortcut) {
          const [modifiers] = this.asm.commandManager.parseShortcut(options.shortcut);
          creator.modifiers = modifiers;
        }
        elem.onClick((e) => {
          e.preventDefault();
          this.executeTool(options);
        });
        if (options.icon || options.title) {
          const icon = new ElementHelper(
            'DIV',
            'textarena-creator__item-icon',
            options.icon || options.title,
          );
          elem.appendChild(icon);
        }
        if (options.hint) {
          const keyElem = new ElementHelper('DIV', 'textarena-creator__hint', options.hint);
          elem.appendChild(keyElem);
        }
        this.list.append(elem);
        this.creators.push(creator);
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
    const selection = this.asm.view.getCurrentSelection();

    if (selection
      && selection.isCollapsed()) {
      const { node, offset } = selection.getCursor();
      const target = this.asm.view.findElementByNodeAndOffset(node, offset);
      if (target) {
        this.show(node, target as HTMLElement);
        return;
      }
    }
    this.hide();
  }

  private keyUpListener(e: KeyboardEvent): void {
    const modifiersSum = this.asm.browser.getModifiersSum(e);
    this.showHints(modifiersSum);
  }

  private keyDownListener(e: KeyboardEvent): void {
    const modifiersSum = this.asm.browser.getModifiersSum(e);
    if (this.showed && this.active) {
      if (modifiersSum === 0 && e.code === 'ArrowRight') {
        this.activeCreator();
      }
      if (modifiersSum === 0 && e.code === 'ArrowLeft') {
        this.activeCreator(false);
      }
      if (modifiersSum === 0 && e.code === 'Escape') {
        this.closeList();
        this.asm.textarena.getEditorElement().focus();
      }
      if (this.asm.browser.isModificationEvent(e)) {
        e.preventDefault();
        this.showHints(modifiersSum);
      } else if (modifiersSum !== 0 && e.code) {
        this.asm.browser.keyDownListener(e);
        this.asm.textarena.getEditorElement().focus();
      }
    }
  }

  private activeCreator(right = true) {
    const activeCreator = this.creators.find(
      (some) => some.elem.getElem() === document.activeElement,
    );
    const creators = this.creators.filter((creator) => creator.show);
    const len = creators.length;
    if (activeCreator) {
      const index = creators.indexOf(activeCreator);
      if (right) {
        if (index === len - 1) {
          creators[0].elem.focus();
        } else {
          creators[index + 1].elem.focus();
        }
      } else if (index === 0) {
        creators[len - 1].elem.focus();
      } else {
        creators[index - 1].elem.focus();
      }
    } else if (len > 0) {
      creators[0].elem.focus();
    }
  }

  private executeTool(options: CreatorOptions): void {
    const selection = this.asm.view.getCurrentSelection();
    this.asm.commandManager.execCommand(options.command, selection);
    this.hide();
  }

  private canShow(node: AnyArenaNode): boolean {
    let result = false;
    this.creators.forEach((creator) => {
      const { elem, options: { canShow } } = creator;
      const show = canShow ? canShow(node) : true;
      // eslint-disable-next-line no-param-reassign
      creator.show = show;
      if (show) {
        result = true;
        elem.css({
          display: 'block',
        });
      } else {
        elem.css({
          display: 'none',
        });
      }
    });
    return result;
  }

  getElem(): HTMLElement {
    return this.elem.getElem();
  }

  show(node: AnyArenaNode, target: HTMLElement): void {
    if (this.canShow(node)) {
      // target.appendChild(this.elem.getElem());
      this.showed = true;
      this.buttonWrapper.css({
        height: `${target.offsetHeight}px`,
      });
      this.elem.css({
        display: 'flex',
        top: `${target.offsetTop}px`,
      });
    } else if (this.showed) {
      this.hide();
    }
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
    this.creators.forEach((tool: Creator) => {
      tool.elem.removeClass('textarena-creator__item_show-hint');
    });
    // this.asm.textarena.getEditorElement().focus();
  }
}
