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

const defaultOptions: TextarenaOptions = {
  editable: true,
  debug: false,
  toolbar: {
    enabled: true,
    tools: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'list',
      'orderedlist',
      'h2',
      'h3',
      'h4',
      'link',
    ],
  },
  creatorBar: {
    enabled: true,
    creators: [
      'hr',
      'img',
      'blockquote',
    ],
  },
};

class Textarena {
  container: ElementHelper;

  editor: ElementHelper;

  logger: ArenaLogger;

  eventManager: EventManager;

  parser: ArenaParser;

  manipulator: Manipulator;

  toolbar: Toolbar;

  creatorBar: CreatorBar;

  options: TextarenaOptions = {};

  meta: MetaData = {};

  constructor(container: HTMLElement, options?: TextarenaOptions) {
    this.container = new ElementHelper(container, 'textarena-container', '');
    this.editor = new ElementHelper('DIV', 'textarena-editor');
    this.logger = new ArenaLogger();
    this.eventManager = new EventManager(this.logger);
    this.parser = new ArenaParser(this.editor, this.logger);
    this.manipulator = new Manipulator(this.editor, this.eventManager, this.parser);
    this.toolbar = new Toolbar(this.container, this.editor, this.eventManager);
    this.creatorBar = new CreatorBar(this.editor, this.eventManager, this.parser);
    this.container.appendChild(this.creatorBar.getElem());
    this.container.appendChild(this.editor.getElem());
    this.container.appendChild(this.toolbar.getElem());
    this.setPlugins([new Hr(), new Image(), new Quote()]);
    this.setOptions(options ? { ...defaultOptions, ...options } : defaultOptions);
    this.start();
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
      this.logger.setDebug(options.debug);
    }
  }

  getData(): TextarenaData {
    return {
      content: this.editor.getInnerHTML(),
      meta: this.meta,
    };
  }

  setData(data: TextarenaData): void {
    if (typeof data.content === 'string') {
      this.parser.insert(data.content, true);
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

  setPlugins(plugins: ArenaPlugin[]): void {
    plugins.forEach((plugin) => {
      plugin.register(this);
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
