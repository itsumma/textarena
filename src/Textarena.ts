import ArenaSelection from 'helpers/ArenaSelection';
import ElementHelper from 'helpers/ElementHelper';

import Arena from 'interfaces/Arena';
import ArenaAncestor from 'interfaces/ArenaAncestor';
import ArenaFormating, { TagAndAttributes } from 'interfaces/ArenaFormating';
import ArenaInline from 'interfaces/ArenaInline';
import ArenaNodeInline from 'interfaces/ArenaNodeInline';
import ArenaOptions from 'interfaces/ArenaOptions';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaWithText from 'interfaces/ArenaWithText';
import ChangeDataListener from 'interfaces/ChangeHandler';
import CommandAction from 'interfaces/CommandAction';
import CreatorBarOptions from 'interfaces/CreatorBarOptions';
import CreatorOptions from 'interfaces/CreatorOptions';
import MetaData from 'interfaces/MetaData';
import TextarenaData from 'interfaces/TextarenaData';
import TextarenaOptions from 'interfaces/TextarenaOptions';
import ToolbarOptions from 'interfaces/ToolbarOptions';
import ToolOptions from 'interfaces/ToolOptions';

import calloutPlugin from 'plugins/calloutPlugin';
import commonPlugin from 'plugins/commonPlugin';
import formatingsPlugin from 'plugins/formatingsPlugin';
import headersPlugin from 'plugins/headersPlugin';
import hrPlugin from 'plugins/hrPlugin';
import imagePlugin from 'plugins/imagePlugin';
import linkPlugin from 'plugins/linkPlugin';
import listsPlugin from 'plugins/listsPlugin';
import paragraphPlugin from 'plugins/paragraphPlugin';

import ArenaCommandManager from 'services/ArenaCommandManager';
import ArenaServiceManager from 'services/ArenaServiceManager';

const defaultOptions: TextarenaOptions = {
  editable: true,
  debug: false,
  toolbar: {
    enabled: true,
    tools: [
      'strong',
      'emphasized',
      'underline',
      'strikethrough',
      'paragraph',
      'unordered-list',
      'ordered-list',
      'header2',
      'header3',
      'header4',
      'link',
    ],
  },
  creatorBar: {
    enabled: true,
    creators: [
      'hr',
      'unordered-list',
      'ordered-list',
      'header2',
      'header3',
      'header4',
      'callout',
      'image',
      // 'blockquote',
    ],
  },
  plugins: [
    commonPlugin(),
    paragraphPlugin(),
    formatingsPlugin(),
    headersPlugin(),
    hrPlugin(),
    listsPlugin(),
    calloutPlugin(),
    imagePlugin(),
    linkPlugin(),
  ],
};

class Textarena {
  protected debug = false;

  protected container: ElementHelper;

  protected editor: ElementHelper;

  protected options: TextarenaOptions = {};

  protected meta: MetaData = {};

  protected asm: ArenaServiceManager;

  constructor(container: HTMLElement, options?: TextarenaOptions) {
    // DOM Elements
    this.container = new ElementHelper(container, 'textarena-container', '');
    this.editor = new ElementHelper('DIV', 'textarena-editor');
    this.container.appendChild(this.editor.getElem());

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
    if (options.onChange !== undefined) {
      this.setOnChange(options.onChange);
    }
    if (options.onReady !== undefined) {
      this.setOnReady(options.onReady);
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
    if (options.initData !== undefined) {
      this.setData(options.initData);
    }
    if (options.editable !== undefined) {
      this.setEditable(options.editable);
    }
    if (options.debug !== undefined) {
      this.debug = options.debug;
      this.asm.logger.setDebug(options.debug);
    }
  }

  public getData(): TextarenaData {
    return {
      html: this.getHtml(),
      dataHtml: this.editor.getInnerHTML()
        .replace(/<!--(?!-->)*-->/g, '')
        .replace(/^[\s\n]+/, '')
        .replace(/[\s\n]+$/, '')
        .replace(/(<[\w-]+)\s+observe-id="[\d.]+"/g, '$1')
        .replace(/(<p)/g, '\n$1'),
    };
  }

  public getHtml(): string {
    return this.asm.model.getOutputHtml();
  }

  public setData(data: TextarenaData): void {
    if (typeof data.dataHtml === 'string') {
      this.asm.parser.insertHtmlToRoot(data.dataHtml);
      this.asm.view.render();
    }
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
    this.asm.creatorBar.setOptions(creatorBarOptions);
  }

  public getRootArenaName(): string {
    return this.asm.model.rootArenaName;
  }

  protected simpleArenas: Arena[] = [];

  public getSimpleArenas(): Arena[] {
    return this.simpleArenas;
  }

  public addSimpleArenas(arena: Arena): void {
    this.simpleArenas.push(arena);
  }

  public setDefaultTextArena(arena: ArenaAncestor | ArenaWithText): void {
    this.asm.model.model.arena.setArenaForText(arena as ArenaWithText);
  }

  public getDefaultTextArena(): ArenaAncestor | ArenaWithText | undefined {
    return this.asm.model.model.arena.getArenaForText();
  }

  public registerArena(
    arenaOptions: ArenaOptions,
    markers?: TagAndAttributes[],
    parentArenas?: string[],
  ): Arena {
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
  ): ArenaCommandManager {
    return this.asm.commandManager.registerShortcut(shortcut, command);
  }

  public registerTool(opts: ToolOptions): void {
    this.asm.toolbar.registerTool(opts);
  }

  public registerCreator(opts: CreatorOptions): void {
    this.asm.creatorBar.registerCreator(opts);
  }

  public transformModel(selection: ArenaSelection, arena: Arena): ArenaSelection {
    return this.asm.model.transformModel(selection, arena);
  }

  public breakSelection(selection: ArenaSelection): ArenaSelection {
    return this.asm.model.breakSelection(selection);
  }

  public moveChild(selection: ArenaSelection, direction: 'up' | 'down'): ArenaSelection {
    return this.asm.model.moveChild(selection, direction);
  }

  public formatingModel(selection: ArenaSelection, formating: ArenaFormating): ArenaSelection {
    return this.asm.model.formatingModel(selection, formating);
  }

  public addInlineNode(selection: ArenaSelection, arena: ArenaInline): ArenaNodeInline | undefined {
    return this.asm.model.addInlineNode(selection, arena);
  }

  public getInlineNode(selection: ArenaSelection, arena: ArenaInline): ArenaNodeInline | undefined {
    return this.asm.model.getInlineNode(selection, arena);
  }

  public removeInlineNode(selection: ArenaSelection, node: ArenaNodeInline): void {
    return this.asm.model.removeInlineNode(selection, node);
  }

  public updateInlineNode(selection: ArenaSelection, node: ArenaNodeInline): void {
    return this.asm.model.updateInlineNode(selection, node);
  }

  protected start(): void {
    this.asm.eventManager.subscribe('modelChanged', (e) => {
      if (typeof e === 'object') {
        this.asm.view.render(e.data instanceof ArenaSelection ? e.data : undefined);
      }
      if (this.options.onChange) {
        this.options.onChange(this.getData());
      }
    });
    if (this.options.onReady) {
      this.options.onReady(this.getData());
    }
    if (this.debug) {
      window.asm = this.asm;
    }
  }
}

declare global {
  interface Window { asm: undefined | ArenaServiceManager; }
}

export default Textarena;
