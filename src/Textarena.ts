import ArenaParser from 'ArenaParser';
import CreatorBar from 'CreatorBar';
import ElementHelper from 'ElementHelper';
import EventManager from 'EventManager';
import Manipulator from 'Manipulator';
import Toolbar from 'Toolbar';
import ChangeDataListener from 'interfaces/ChangeHandler';
import CreatorBarOptions from 'interfaces/CreatorBarOptions';
import MetaData from 'interfaces/MetaData';
import TextarenaData from 'interfaces/TextarenaData';
import TextarenaOptions from 'interfaces/TextarenaOptions';
import ToolbarOptions from 'interfaces/ToolbarOptions';
import ArenaLogger from 'ArenaLogger';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import Hr from 'plugins/Hr';
import Image from 'plugins/Image';
import Quote from 'plugins/Blockquote';
import Callout from 'components/Callout';
import ArenaBrowser from 'ArenaBrowser';
import { TemplateResult, html } from 'lit-html';
import ArenaModel from 'ArenaModel';
import ArenaView from 'ArenaView';
import ArenaCommandManager from 'ArenaCommandManager';
import headersPlugin from 'plugins/headersPlugin';
import paragraphPlugin from 'plugins/paragraphPlugin';
import formatingsPlugin from 'plugins/formatingsPlugin';
import commonPlugin from 'plugins/commonPlugin';
import hrPlugin from 'plugins/hrPlugin';
import listsPlugin from 'plugins/listsPlugin';

// FIXME как инициализировать кмопоненты.
const callout = new Callout();

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
      // 'list',
      // 'orderedlist',
      // 'h2',
      // 'h3',
      // 'h4',
      // 'link',
    ],
  },
  creatorBar: {
    enabled: true,
    creators: [
      'hr',
      // 'img',
      // 'blockquote',
    ],
  },
  plugins: {
    common: commonPlugin,
    paragraph: paragraphPlugin,
    formatings: formatingsPlugin,
    headers: headersPlugin,
    hr: hrPlugin,
    lists: listsPlugin,
  },
  pluginOptions: {
    headers: {
      tags: ['h2', 'h3', 'h4'],
    },
    formatings: {
      tags: ['b', 'i'],
    },
  },
};

class Textarena {
  container: ElementHelper;

  editor: ElementHelper;

  logger: ArenaLogger;

  eventManager: EventManager;

  browser: ArenaBrowser;

  view: ArenaView;

  commandManager: ArenaCommandManager;

  parser: ArenaParser;

  model: ArenaModel;

  // manipulator: Manipulator;

  toolbar: Toolbar;

  creatorBar: CreatorBar;

  options: TextarenaOptions = {};

  meta: MetaData = {};

  constructor(container: HTMLElement, options?: TextarenaOptions) {
    // DOM Elements
    this.container = new ElementHelper(container, 'textarena-container', '');
    this.editor = new ElementHelper('DIV', 'textarena-editor');

    // Services
    this.eventManager = new EventManager(this);
    this.logger = new ArenaLogger();
    this.parser = new ArenaParser(this);
    this.model = new ArenaModel(this);
    this.browser = new ArenaBrowser(this);
    this.view = new ArenaView(this);
    this.commandManager = new ArenaCommandManager(this);
    this.container.appendChild(this.editor.getElem());
    this.toolbar = new Toolbar(this);
    this.creatorBar = new CreatorBar(this);
    // this.manipulator = new Manipulator(this.editor, this.eventManager, this.parser);

    // this.setPlugins([new Hr(), new Image(), new Quote()]);
    this.setOptions(options ? { ...defaultOptions, ...options } : defaultOptions);
    this.start();
    window['ta'] = this;
  }

  start(): void {
    this.eventManager.subscribe('textChanged', () => {
      if (this.options.onChange) {
        this.options.onChange(this.getData());
      }
    });
    if (this.options.onReady) {
      this.options.onReady(this.getData());
    }
  }

  destructor(): void {
    this.eventManager.fire('turnOff');
  }

  setOptions(options: TextarenaOptions): void {
    if (options.onChange !== undefined) {
      this.setOnChange(options.onChange);
    }
    if (options.onReady !== undefined) {
      this.setOnReady(options.onReady);
    }
    if (options.plugins) {
      this.setPlugins(options.plugins, options.pluginOptions);
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
      this.logger.setDebug(options.debug);
    }
  }

  getData(): TextarenaData {
    return {
      content: this.editor.getInnerHTML()
        .replace(/<!--(?!-->)*-->/g, '')
        .replace(/^[\s\n]+/, '')
        .replace(/[\s\n]+$/, '')
        .replace(/(<\w+)\s+observe-id="[\d.]+"/g, '$1')
        .replace(/(<p)/g, '\n$1')
        // .replace(/>[\s\n]+</g, '')
        ,
      meta: this.meta,
    };
  }

  setData(data: TextarenaData): void {
    if (typeof data.content === 'string') {
      this.parser.insertHtmlToRoot(data.content);
      // this.parser.insertHtmlToModel(
      // '<h2>titl<i>e</i></h2><p>blah <em>it <b>bold</b> </em></p><p>blah <b>bold</b></p>',
      // this.parser.model, 0);
      this.view.render();
      // this.parser.insert(data.content, true);
    }
    if (data.meta) {
      this.meta = data.meta;
    }
  }

  setEditable(editable: boolean): void {
    if (this.options.editable !== editable) {
      if (editable) {
        this.eventManager.fire('turnOn');
      } else {
        this.eventManager.fire('turnOff');
      }
      this.options.editable = editable;
      this.editor.setContentEditable(editable);
    }
  }

  setOnChange(onChange: ChangeDataListener): void {
    this.options.onChange = onChange;
  }

  setOnReady(onReady: ChangeDataListener): void {
    this.options.onReady = onReady;
  }

  setPlugins(
    plugins: {[key: string]: ArenaPlugin},
    options?: {[key: string]: any},
  ): void {
    Object.entries(plugins).forEach(([name, plugin]) => {
      plugin.register(this, options && options[name] ? options[name] : undefined);
    });
  }

  setToolbarOptions(toolbarOptions: ToolbarOptions): void {
    this.toolbar.setOptions(toolbarOptions);
  }

  setCreatorBarOptions(creatorBarOptions: CreatorBarOptions): void {
    this.creatorBar.setOptions(creatorBarOptions);
  }

  // TODO вынести это в плагин для картинок
  // processElements(): void {
  //   const figures = document.querySelectorAll('figure');
  //   for (let i = 0; i < figures.length; i += 1) {
  //     const figure = figures[i];
  //     observeHTMLElement(figure, this.eventManager);
  //   }
  // }
}

export default Textarena;
