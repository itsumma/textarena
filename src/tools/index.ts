import ToolOptions from '~/interfaces/ToolOptions';
import style from './style';
import header from './header';
import foreColor from './foreColor';
import styleState from './styleState';
import link from './link';

const tools: {[key: string]: ToolOptions} = {
  bold: {
    name: 'bold',
    title: 'Bold',
    icon: '<b>B</b>',
    controlKey: 'b',
    config: {
      style: 'bold',
    },
    state: styleState,
    processor: style,
  },
  italic: {
    name: 'italic',
    title: 'Italic',
    icon: '<i>I</i>',
    controlKey: 'i',
    config: {
      style: 'italic',
    },
    state: styleState,
    processor: style,
  },
  underline: {
    name: 'underline',
    title: 'Underline',
    icon: '<u>U</u>',
    controlKey: 'u',
    config: {
      style: 'underline',
    },
    state: styleState,
    processor: style,
  },
  strikethrough: {
    name: 'strikethrough',
    title: 'Strikethrough',
    icon: '<s>S</s>',
    altKey: 's',
    config: {
      style: 'strikethrough',
    },
    state: styleState,
    processor: style,
  },
  list: {
    name: 'list',
    title: 'Unordered list',
    icon: '=',
    altKey: 'l',
    config: {
      style: 'insertunorderedlist',
    },
    state: styleState,
    processor: style,
  },
  orderedlist: {
    name: 'orderedlist',
    title: 'Ordered list',
    icon: '1.',
    altKey: 'o',
    config: {
      style: 'insertorderedlist',
    },
    state: styleState,
    processor: style,
  },
  h1: {
    name: 'h1',
    title: 'H1',
    icon: '<b>H1</b>',
    altKey: '1',
    config: {
      header: 'H1',
    },
    processor: header,
  },
  h2: {
    name: 'h2',
    title: 'H2',
    icon: '<b>H2</b>',
    altKey: '2',
    config: {
      header: 'H2',
    },
    processor: header,
  },
  h3: {
    name: 'h3',
    title: 'H3',
    icon: '<b>H3</b>',
    altKey: '3',
    config: {
      header: 'H3',
    },
    processor: header,
  },
  h4: {
    name: 'h4',
    title: 'H4',
    icon: '<b>H4</b>',
    altKey: '4',
    config: {
      header: 'H4',
    },
    processor: header,
  },
  foreColor: {
    name: 'foreColor',
    icon: 'f',
    title: 'ForeColor',
    altKey: 'c',
    config: {
      color: '#545454',
    },
    processor: foreColor,
  },
  link: {
    name: 'link',
    icon: '🔗',
    title: 'Link',
    controlKey: 'k',
    processor: link,
  },
};

export default tools;
