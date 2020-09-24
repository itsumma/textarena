import MediaTextData from "./interfaces/MediaTextData";
import MediaTextOptions from "./interfaces/MediaTextOptions";
import MetaData from "./interfaces/MetaData";
import ChangeDataListener from "./interfaces/ChangeHandler";
import HTMLLicker from "./HTMLLicker";
import Manipulator from "./Manipulator";
import Toolbar from "./Toolbar";
import EventManager from "./EventManager";
import ToolbarOptions from "./interfaces/ToolbarOptions";
import CreatorBar from "./CreatorBar";
import CreatorBarOptions from "./interfaces/CreatorBarOptions";

const defaultOptions: MediaTextOptions = {
  editable: true,
  toolbar: {
    enabled: true,
    tools: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'h2',
      'h3',
      'h4',
    ],
  },
  creatorBar: {
    enabled: true,
    creators: [
      'hr',
      'hr',
    ]
  }
};

class MediaText {
  elem: HTMLElement;
  eventManager: EventManager;
  manipulator: Manipulator;
  toolbar: Toolbar;
  creatorBar: CreatorBar;
  options: MediaTextOptions = {};
  meta: MetaData = {};

  constructor (container: HTMLElement, options?: MediaTextOptions) {
    this.elem = document.createElement('DIV');
    this.elem.className = 'mediatext-editor';
    this.eventManager = new EventManager();
    this.eventManager.subscribe('textChanged', () => {
      if (this.options.onChange) {
        this.options.onChange(this.getData());
      }
    });
    this.manipulator = new Manipulator(this.elem, this.eventManager);
    this.toolbar = new Toolbar(this.elem, this.eventManager);
    this.creatorBar = new CreatorBar(this.elem, this.eventManager);
    container.innerHTML = '';
    container.className = 'mediatext-container';
    container.appendChild(this.elem);
    container.appendChild(this.creatorBar.getElem());
    container.appendChild(this.toolbar.getElem());
    this.setOptions(options ? { ...defaultOptions, ...options } : defaultOptions);
  }

  destructor() {
    console.log('destructed');
    this.eventManager.fire('turnOff');
  }

  setOptions(options: MediaTextOptions) {
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

  getData(): MediaTextData {
    return {
      content: this.elem.innerHTML,
      meta: this.meta,
    }
  }

  setData(data: MediaTextData) {
    if (typeof data.content === 'string') {
      this.elem.innerHTML = (new HTMLLicker(data.content)).prepareHTML().getHtml();
      this.manipulator.checkFirstLine();
    }
    if (data.meta) {
      this.meta = data.meta;
    }
  }

  setEditable(editable: boolean) {
    if (this.options.editable !== editable) {
      if (editable) {
        this.eventManager.fire('turnOn');
      } else {
        this.eventManager.fire('turnOff');
      }
      this.options.editable = editable;
      this.elem.contentEditable = editable ? 'true' : 'false';
    }
  }

  setOnChange(onChange: ChangeDataListener) {
    this.options.onChange = onChange;
  }

  setToolbarOptions(toolbarOptions: ToolbarOptions) {
    this.toolbar.setOptions(toolbarOptions);
  }

  setCreatorBarOptions(creatorBarOptions: CreatorBarOptions) {
    this.creatorBar.setOptions(creatorBarOptions);
  }
}

export default MediaText;