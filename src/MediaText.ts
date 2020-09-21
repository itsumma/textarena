import MediaTextData from "./interfaces/MediaTextData";
import MediaTextOptions from "./interfaces/MediaTextOptions";
import MetaData from "./interfaces/MetaData";
import ChangeDataListener from "./interfaces/ChangeHandler";
import HTMLLicker from "./HTMLLicker";
import Manipulator from "./Manipulator";
import Toolbar from "./Toolbar";

const defaultOptions: MediaTextOptions = {
  editable: true,
  toolbar: {
    enabled: true,
    tools: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
    ]
  }
};

class MediaText {
  elem: HTMLElement;
  manipulator: Manipulator;
  toolbar: Toolbar;
  options: MediaTextOptions = {};
  meta: MetaData = {};

  constructor (container: HTMLElement, options?: MediaTextOptions) {
    this.elem = document.createElement('DIV');
    this.manipulator = new Manipulator(this.elem, () => {
      if (this.options.onChange) {
        this.options.onChange(this.getData());
      }
    });
    this.toolbar = new Toolbar();
    container.innerHTML = '';
    container.appendChild(this.elem);
    container.appendChild(this.toolbar.getElem());
    this.setOptions(options ? { ...defaultOptions, ...options } : defaultOptions);
    if (this.options.editable) {
      this.manipulator.turnOn();
      this.toolbar.turnOn();
    }
  }

  destructor() {
    this.manipulator.turnOff();
    this.toolbar.turnOff();
    console.log('destructed');
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
        this.manipulator.turnOn();
        this.toolbar.turnOn();
      } else {
        this.manipulator.turnOff();
        this.toolbar.turnOff();
      }
      this.options.editable = editable;
      this.elem.contentEditable = editable ? 'true' : 'false';
    }
  }

  setOnChange(onChange: ChangeDataListener) {
    this.options.onChange = onChange;
  }
}

export default MediaText;