import { observeHTMLElement } from 'utils';
import ElementHelper from 'ElementHelper';
import TextarenaData from './interfaces/TextarenaData';
import TextarenaOptions from './interfaces/TextarenaOptions';
import MetaData from './interfaces/MetaData';
import ChangeDataListener from './interfaces/ChangeHandler';
import HTMLLicker from './HTMLLicker';
import Manipulator from './Manipulator';
import Toolbar from './Toolbar';
import EventManager from './EventManager';
import ToolbarOptions from './interfaces/ToolbarOptions';
import CreatorBar from './CreatorBar';
import CreatorBarOptions from './interfaces/CreatorBarOptions';

const defaultOptions: TextarenaOptions = {
  editable: true,
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
    ],
  },
};

class Textarena {
  elem: ElementHelper;

  eventManager: EventManager;

  manipulator: Manipulator;

  toolbar: Toolbar;

  creatorBar: CreatorBar;

  options: TextarenaOptions = {};

  meta: MetaData = {};

  constructor(private container: HTMLElement, options?: TextarenaOptions) {
    this.elem = new ElementHelper('DIV', 'textarena-editor');
    this.eventManager = new EventManager();
    this.eventManager.subscribe('textChanged', () => {
      if (this.options.onChange) {
        this.options.onChange(this.getData());
      }
    });
    this.manipulator = new Manipulator(this.elem, this.eventManager);
    this.toolbar = new Toolbar(this.container, this.elem, this.eventManager);
    this.creatorBar = new CreatorBar(this.elem, this.eventManager);
    this.container.innerHTML = '';
    this.container.className = 'textarena-container';
    container.appendChild(this.creatorBar.getElem());
    container.appendChild(this.elem.getElem());
    container.appendChild(this.toolbar.getElem());
    this.setOptions(options ? { ...defaultOptions, ...options } : defaultOptions);
  }

  destructor(): void {
    this.eventManager.fire('turnOff');
  }

  setOptions(options: TextarenaOptions): void {
    if (options.editable) {
      this.setEditable(options.editable);
    }
    if (options.onChange) {
      this.setOnChange(options.onChange);
    }
    if (options.initData) {
      this.setData(options.initData);
    }
    if (options.toolbar) {
      this.setToolbarOptions(options.toolbar);
    }
    if (options.creatorBar) {
      this.setCreatorBarOptions(options.creatorBar);
    }
  }

  getData(): TextarenaData {
    return {
      content: this.elem.getInnerHTML(),
      meta: this.meta,
    };
  }

  setData(data: TextarenaData): void {
    if (typeof data.content === 'string') {
      this.elem.setInnerHTML((new HTMLLicker(data.content)).prepareHTML().getHtml());
      this.processElements();
      this.manipulator.checkFirstLine();
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
      this.elem.setContentEditable(editable);
    }
  }

  setOnChange(onChange: ChangeDataListener): void {
    this.options.onChange = onChange;
  }

  setToolbarOptions(toolbarOptions: ToolbarOptions): void {
    this.toolbar.setOptions(toolbarOptions);
  }

  setCreatorBarOptions(creatorBarOptions: CreatorBarOptions): void {
    this.creatorBar.setOptions(creatorBarOptions);
  }

  processElements(): void {
    const figures = document.querySelectorAll('figure');
    for (let i = 0; i < figures.length; i += 1) {
      const figure = figures[i];
      observeHTMLElement(figure, this.eventManager);
    }
  }
}

export default Textarena;
