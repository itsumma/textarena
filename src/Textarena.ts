import { Direction } from './events/RemoveEvent';

import ArenaSelection from './helpers/ArenaSelection';
import ElementHelper from './helpers/ElementHelper';

import {
  AnyArena,
  ArenaInlineInterface, ArenaMediatorInterface, ArenaTextInterface, ChildArena,
} from './interfaces/Arena';
import {
  AnyArenaNode, ArenaNodeInline, ArenaNodeRoot, ArenaNodeText, ChildArenaNode, ParentArenaNode,
} from './interfaces/ArenaNode';
import ArenaFormating, { TagAndAttributes } from './interfaces/ArenaFormating';
import ArenaOptionsChild from './interfaces/ArenaOptions';
import ArenaPlugin from './interfaces/ArenaPlugin';
import ChangeDataListener from './interfaces/ChangeHandler';
import CommandAction from './interfaces/CommandAction';
import CreatorBarOptions from './interfaces/CreatorBarOptions';
import CreatorOptions from './interfaces/CreatorOptions';
import MetaData from './interfaces/MetaData';
import TextarenaData from './interfaces/TextarenaData';
import TextarenaOptions from './interfaces/TextarenaOptions';
import ToolbarOptions from './interfaces/ToolbarOptions';
import ToolOptions from './interfaces/ToolOptions';

import blockquotePlugin from './plugins/blockquotePlugin';
import calloutPlugin from './plugins/callout/calloutPlugin';
import commonPlugin from './plugins/commonPlugin';
import pastePlugin from './plugins/pastePlugin';
import embedPlugin from './plugins/embed/embedPlugin';
import formatingsPlugin from './plugins/formatingsPlugin';
import headersPlugin from './plugins/headersPlugin';
import hrPlugin from './plugins/hrPlugin';
import imagePlugin from './plugins/image/imagePlugin';
import linkPlugin from './plugins/link/linkPlugin';
import listsPlugin from './plugins/listsPlugin';
import nestedlistsPlugin from './plugins/nestedlistsPlugin';
import paragraphPlugin from './plugins/paragraphPlugin';
import backImagePlugin from './plugins/backImage/backImagePlugin';

import ArenaCommandManager from './services/ArenaCommandManager';
import ArenaServiceManager from './services/ArenaServiceManager';
import ArenaModel from './services/ArenaModel';
import { ArenaHandler } from './services/EventManager';
import asidePlugin from './plugins/asidePlugin';
import quotePlugin from './plugins/quoteBlock/quoteBlockPlugin';
import figurePlugin from './plugins/figure/figurePlugin';
import typoSugarPlugin from './plugins/typoSugarPlugin';
import codePlugin from './plugins/codePlugin';
import twoColumnsPlugin from './plugins/twoColumns/twoColumnsPlugin';
import roadmapPlugin from './plugins/roadmapPlugin';
import tablePlugin from './plugins/table/tablePlugin';
import { ArenaInterval } from './interfaces/ArenaInterval';
import contentsPlugin from './plugins/contents/contentsPlugin';
import ArenaMiddleware from './interfaces/ArenaMiddleware';
import ArenaHistory from './services/ArenaHistory';
import { MiddlewareWhenCondition } from './services/ArenaMiddlewareManager';
import videoPlugin from './plugins/video/videoPlugin';

export const defaultOptions: TextarenaOptions = {
  editable: true,
  debug: false,
  placeholder: 'Enter text or press Alt + Q',
  toolbar: {
    enabled: true,
    tools: [
      'strong',
      'emphasized',
      'underline',
      'strikethrough',
      'subscript',
      'superscript',
      'mark',
      'link',
      'header2',
      'header3',
      'header4',
      'unordered-list',
      'ordered-list',
      'aside',
      'blockquote',
      'clearFormatings',
    ],
  },
  creatorBar: {
    enabled: true,
    creators: [
      'header2',
      'header3',
      'header4',
      'unordered-list',
      'ordered-list',
      'hr',
      'figure',
      'video',
      'blockquote',
      'embed',
      'aside',
    ],
  },
  plugins: [
    commonPlugin(),
    pastePlugin(),
    formatingsPlugin(),
    typoSugarPlugin(),
    paragraphPlugin(),
    linkPlugin(),
    headersPlugin(),
    listsPlugin(),
    hrPlugin(),
    blockquotePlugin(),
    asidePlugin(),
    codePlugin(),
    imagePlugin(),
    videoPlugin(),
    figurePlugin(),
    embedPlugin(),
  ],
};

class Textarena {
  constructor(container: HTMLElement, options?: TextarenaOptions) {
    // DOM Elements
    this.container = new ElementHelper(container, 'textarena-container', '');
    this.editor = new ElementHelper('DIV', 'textarena-editor');
    this.placeholder = new ElementHelper('DIV', 'textarena-placeholder');
    this.container.appendChild(this.editor);
    this.container.appendChild(this.placeholder);

    // Services
    this.asm = new ArenaServiceManager(this);

    this.setOptions(options ? { ...defaultOptions, ...options } : defaultOptions);
    this.start();
  }

  public getContainerElement(): ElementHelper {
    return this.container;
  }

  public getEditorElement(): ElementHelper {
    return this.editor;
  }

  public destructor(): void {
    this.asm.eventManager.fire('turnOff');
  }

  public setOptions(options: TextarenaOptions): void {
    if (options.placeholder !== undefined) {
      this.placeholderText = options.placeholder;
      this.placeholder.setInnerHTML(options.placeholder);
    }
    if (options.onChange !== undefined) {
      this.setOnChange(options.onChange);
    }
    if (options.onReady !== undefined) {
      this.setOnReady(options.onReady);
    }
    if (options.onEvent !== undefined) {
      this.setOnEvent(options.onEvent);
    }
    if (options.plugins) {
      this.setPlugins(options.plugins);
    }
    if (options.toolbar !== undefined) {
      this.setToolbarOptions(options.toolbar);
    }
    if (options.creatorBar !== undefined) {
      this.setCreatorBarOptions(options.creatorBar);
    }
    // if (options.initData !== undefined) {
    this.setData(options.initData);
    // }
    if (options.editable !== undefined) {
      this.setEditable(options.editable);
    }
    if (options.debug !== undefined) {
      this.debug = options.debug;
      this.asm.logger.setDebug(options.debug);
    }
    if (options.outputTypes !== undefined) {
      this.outputTypes = options.outputTypes;
    }
  }

  public getData(types?: string[]): TextarenaData {
    const result: TextarenaData = {
      html: this.getOutput('html'),
      dataHtml: this.getDataHtml(),
      json: this.getJson(),
    };
    types?.forEach((type) => {
      if (!result[type]) {
        result[type] = this.getOutput(type);
      }
    });
    return result;
  }

  public getDataHtml(): string {
    return this.asm.model.getDataHtml();
  }

  public getOutput(type: string): string {
    return this.asm.model.getOutput(type);
  }

  public getJson(): string {
    return this.asm.model.getJson();
  }

  public setData(data: Partial<TextarenaData> | undefined): void {
    const html = data && typeof data.dataHtml === 'string' ? data.dataHtml : '';
    this.asm.model.createNewRoot();
    const sel = this.asm.parser.insertHtmlToRoot(html);
    this.asm.history.reset(sel);
    this.asm.view.render();
    this.checkPlaceholder();
  }

  public setEditable(editable: boolean): void {
    if (this.options.editable !== editable) {
      if (editable) {
        this.asm.eventManager.fire('turnOn');
      } else {
        this.asm.eventManager.fire('turnOff');
      }
      this.options.editable = editable;
      this.editor.setContentEditable(editable);
    }
  }

  public setOnChange(onChange: ChangeDataListener): void {
    this.options.onChange = onChange;
  }

  public setOnReady(onReady: ChangeDataListener): void {
    this.options.onReady = onReady;
  }

  public setOnEvent(onEvent: ArenaHandler): void {
    this.options.onEvent = onEvent;
  }

  public setPlugins(
    plugins: ArenaPlugin[],
  ): void {
    plugins.forEach((plugin) => {
      plugin.register(this);
    });
  }

  public setToolbarOptions(toolbarOptions: ToolbarOptions): void {
    this.asm.toolbar.setOptions(toolbarOptions);
  }

  public setCreatorBarOptions(creatorBarOptions: CreatorBarOptions): void {
    this.asm.creatorBar.setOptions({ ...creatorBarOptions, placeholder: this.placeholderText });
  }

  public getRootArenaName(): string {
    return this.asm.model.rootArenaName;
  }

  public getRootModel(): ArenaNodeRoot {
    return this.asm.model.model;
  }

  protected simpleArenas: ChildArena[] = [];

  public getSimpleArenas(): ChildArena[] {
    return this.simpleArenas;
  }

  public addSimpleArenas(arena: ChildArena): void {
    this.simpleArenas.push(arena);
  }

  protected middleArenas: ChildArena[] = [];

  public getMiddleArenas(): ChildArena[] {
    return this.middleArenas;
  }

  public addMiddleArenas(arena: ChildArena): void {
    this.middleArenas.push(arena);
  }

  public setDefaultTextArena(arena: ArenaMediatorInterface | ArenaTextInterface): void {
    this.asm.model.setDefaultTextArena(arena);
  }

  public getDefaultTextArena(): ArenaMediatorInterface | ArenaTextInterface | undefined {
    return this.asm.model.model.arena.getArenaForText();
  }

  public getArena(name: string): AnyArena | undefined {
    return this.asm.model.getArena(name);
  }

  public getArenas(): AnyArena[] {
    return this.asm.model.getArenas();
  }

  public registerArena(
    arenaOptions: ArenaOptionsChild,
    markers?: TagAndAttributes[],
    parentArenas?: string[],
  ): ChildArena | ArenaInlineInterface {
    return this.asm.model.registerArena(
      arenaOptions,
      markers,
      parentArenas,
    );
  }

  public registerFormating(
    formating: ArenaFormating,
    markers: TagAndAttributes[],
  ): ArenaFormating {
    return this.asm.model.registerFormating(formating, markers);
  }

  public registerCommand(
    command: string,
    action: CommandAction,
  ): ArenaCommandManager {
    return this.asm.commandManager.registerCommand(command, action);
  }

  public registerShortcut(
    shortcut: string,
    command: string,
    description?: string,
  ): ArenaCommandManager {
    return this.asm.commandManager.registerShortcut(shortcut, command, description);
  }

  public registerMiddleware(
    middleware: ArenaMiddleware,
    when: MiddlewareWhenCondition,
    opts?: { scope?: AnyArena; priority?: number },
  ): void {
    this.asm.middlewares.registerMiddleware(middleware, when, opts?.scope, opts?.priority);
  }

  public applyMiddlewares(
    sel: ArenaSelection,
    text: string,
    when: MiddlewareWhenCondition,
  ): [boolean, ArenaSelection] {
    return this.asm.middlewares.applyMiddlewares(sel, text, when);
  }

  public registerTool(opts: ToolOptions): void {
    this.asm.toolbar.registerTool(opts);
  }

  public registerCreator(opts: CreatorOptions): void {
    this.asm.creatorBar.registerCreator(opts);
  }

  public applyArenaToSelection(
    selection: ArenaSelection,
    arena: ArenaMediatorInterface | ArenaTextInterface,
  ): ArenaSelection {
    return this.asm.model.applyArenaToSelection(selection, arena);
  }

  public applyFormationToSelection(
    selection: ArenaSelection,
    formating: ArenaFormating,
  ): ArenaSelection {
    return this.asm.model.applyFormationToSelection(selection, formating);
  }

  public clearFormationInSelection(
    selection: ArenaSelection,
  ): ArenaSelection {
    return this.asm.model.clearFormationInSelection(selection);
  }

  public insertBeforeSelected(
    selection: ArenaSelection,
    arena: ChildArena,
    replace = false,
  ): [ArenaSelection, AnyArenaNode | undefined] {
    return this.asm.model.insertBeforeSelected(selection, arena, replace);
  }

  public breakSelection(selection: ArenaSelection): ArenaSelection {
    return this.asm.model.breakSelection(selection);
  }

  public removeSelection(selection: ArenaSelection, direction: Direction): ArenaSelection {
    return this.asm.model.removeSelection(selection, direction);
  }

  public createAndInsertNode(
    arena: ChildArena,
    parent: ParentArenaNode,
    offset: number,
    before = false,
    onlyChild = false,
    replace = false,
  ): ChildArenaNode | undefined {
    return this.asm.model.createAndInsertNode(
      arena,
      parent,
      offset,
      before,
      onlyChild,
      replace,
    );
  }

  public moveChild(selection: ArenaSelection, direction: 'up' | 'down'): ArenaSelection {
    return this.asm.model.moveChild(selection, direction);
  }

  public getInlineInterval(
    selection: ArenaSelection,
  ): ArenaInterval | undefined {
    return this.asm.model.getInlineInterval(selection);
  }

  public addInlineNode(
    selection: ArenaSelection,
    arena: ArenaInlineInterface,
  ): ArenaNodeInline | undefined {
    return this.asm.model.addInlineNode(selection, arena);
  }

  public getInlineNode(
    selection: ArenaSelection,
    arena: ArenaInlineInterface,
  ): [ArenaNodeText, ArenaNodeInline] | undefined {
    return this.asm.model.getInlineNode(selection, arena);
  }

  public removeInlineNode(
    selection: ArenaSelection,
    node: ArenaNodeInline,
  ): void {
    return this.asm.model.removeInlineNode(selection, node);
  }

  public updateInlineNode(
    selection: ArenaSelection,
    node: ArenaNodeInline,
  ): void {
    return this.asm.model.updateInlineNode(selection, node);
  }

  public subscribe(event: string, handler: ArenaHandler): void {
    this.asm.eventManager.subscribe(event, handler);
  }

  public fire(name: string, detail?: unknown): void {
    this.asm.eventManager.fire(name, detail);
  }

  public isAllowedNode(node: AnyArenaNode, arena: ChildArena): boolean {
    return this.asm.model.isAllowedNode(node, arena);
  }

  public getCurrentSelection(): ArenaSelection | undefined {
    return this.asm.view.getCurrentSelection();
  }

  public getModel(): ArenaModel {
    return this.asm.model;
  }

  public getHistory(): ArenaHistory {
    return this.asm.history;
  }

  public insertData(selection: ArenaSelection, data: DataTransfer): ArenaSelection | undefined {
    const [result, newSelection] = this.asm.middlewares.applyMiddlewares(
      selection,
      data,
      'before',
    );
    if (result) {
      this.asm.history.save(newSelection);
      this.asm.eventManager.fire('modelChanged', { selection: newSelection });
      return newSelection;
    }
    return undefined;
  }

  public insertText(selection: ArenaSelection, text: string): ArenaSelection {
    // const newSelection = this.asm.model.insertTextToModel(selection, event.character, true);
    // this.asm.history.save(newSelection, /[a-zа-яА-Я0-9]/i.test(event.character));
    const [resultBefore, newSelBefore] = this.asm.middlewares.applyMiddlewares(
      selection,
      text,
      'before',
    );
    let newSelection = newSelBefore;
    if (!resultBefore) {
      newSelection = this.asm.model.insertTextToModel(newSelection, text, true);
    }
    this.asm.history.save(newSelection);
    const [resultAfter, newSelAfter] = this.asm.middlewares.applyMiddlewares(
      selection,
      text,
      'after',
    );
    if (resultAfter) {
      this.asm.history.save(newSelAfter);
    }
    this.asm.eventManager.fire('modelChanged', { selection: newSelAfter });
    return newSelAfter;
  }

  public insertHtml(selection: ArenaSelection, html: string): ArenaSelection {
    const [resultBefore, newSelBefore] = this.asm.middlewares.applyMiddlewares(
      selection,
      html,
      'before',
    );
    let newSelection = newSelBefore;
    if (!resultBefore) {
      newSelection = this.asm.model.insertHtmlToModel(newSelection, html);
    }
    this.asm.history.save(newSelection);
    const [resultAfter, newSelAfter] = this.asm.middlewares.applyMiddlewares(
      selection,
      html,
      'after',
    );
    if (resultAfter) {
      this.asm.history.save(newSelAfter);
    }
    this.asm.eventManager.fire('modelChanged', { selection: newSelAfter });
    return newSelAfter;
  }

  protected debug = false;

  protected container: ElementHelper;

  protected editor: ElementHelper;

  protected placeholder: ElementHelper;

  protected placeholderText = '';

  protected placeholderShowed = true;

  protected options: TextarenaOptions = {};

  protected meta: MetaData = {};

  protected asm: ArenaServiceManager;

  protected outputTypes: string[] = ['html'];

  protected start(): void {
    this.asm.eventManager.subscribe('modelChanged', (e) => {
      if (typeof e.detail === 'object') {
        const { selection, stopRender } = e.detail as {
          selection: ArenaSelection,
          stopRender?: boolean,
        };
        if (!stopRender) {
          this.asm.view.render(selection instanceof ArenaSelection ? selection : undefined);
        }
      }
      if (this.options.onChange) {
        this.options.onChange(this.getData(this.outputTypes));
      }
      this.checkPlaceholder();
    });
    this.asm.eventManager.subscribe('*', (e) => {
      if (this.options.onEvent) {
        this.options.onEvent(e);
      }
    });
    this.asm.eventManager.fire('ready');
    if (this.options.onReady) {
      this.options.onReady(this.getData());
    }
    if (this.debug) {
      window.asm = this.asm;
    }
  }

  public checkPlaceholder(): void {
    let isEmpty = true;
    if (this.asm.creatorBar.showed) {
      isEmpty = false;
    } else {
      const { children } = this.asm.model.model;
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        if (!child.hasText || child.getTextLength() > 0) {
          isEmpty = false;
          break;
        }
      }
    }
    if (isEmpty && !this.placeholderShowed) {
      this.placeholderShowed = true;
      this.placeholder.css({
        display: 'block',
      });
    }
    if (!isEmpty && this.placeholderShowed) {
      this.placeholderShowed = false;
      this.placeholder.css({
        display: 'none',
      });
    }
  }

  public execCommand(command: string, selection?: ArenaSelection): void {
    this.asm.commandManager.execCommand(command, selection);
  }
}

declare global {
  interface Window {
    asm: undefined | ArenaServiceManager,
    debugSymbol: unknown;
  }
}

Textarena.constructor.prototype.getPlugins = () => ({
  commonPlugin,
  pastePlugin,
  paragraphPlugin,
  formatingsPlugin,
  headersPlugin,
  hrPlugin,
  listsPlugin,
  nestedlistsPlugin,
  blockquotePlugin,
  calloutPlugin,
  imagePlugin,
  videoPlugin,
  figurePlugin,
  embedPlugin,
  linkPlugin,
  asidePlugin,
  codePlugin,
  quotePlugin,
  typoSugarPlugin,
  twoColumnsPlugin,
  roadmapPlugin,
  tablePlugin,
  contentsPlugin,
  backImagePlugin,
});

export default Textarena;
