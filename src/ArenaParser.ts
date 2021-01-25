/* eslint-disable no-console */
import { FilterXSS } from 'xss';
import ElementHelper from 'ElementHelper';
import * as utils from 'utils';
import ArenaLogger from 'ArenaLogger';

type Tag = {
  level: string,
  insideLevel: string | false,
  replaceWith?: string,
};

type Level = {
  raiseTags?: {
    [key: string]: string,
  },
  unwrap?: string | false,
};

type Tags = {
  [key: string]: Tag,
};

type Levels = {
  [key: string]: Level,
};

function wrapElem(child: Element | Text, tagName: string): void {
  const paragraph = document.createElement(tagName);
  paragraph.innerHTML = child instanceof Element ? child.innerHTML : child.textContent || '';
  child.replaceWith(paragraph);
}

function upwrapElem(child: Element, parent: Element): void {
  child.childNodes.forEach(
    (someNode: ChildNode) => parent.insertBefore(someNode, child),
  );
  child.remove();
}

function rewrapElem(child: Element, tagName: string): void {
  const paragraph = document.createElement(tagName);
  paragraph.innerHTML = child.innerHTML || '';
  child.replaceWith(paragraph);
}

export default class ArenaParser {
  private filterXSS: FilterXSS | undefined;

  levels: Levels = {
    EDITOR_LEVEL: {
    },
    ROOT_LEVEL: {
      raiseTags: {
        FORMATED_TEXT_LEVEL: 'P',
        TEXT_LEVEL: 'P',
      },
      unwrap: false,
    },
    FORMATED_TEXT_LEVEL: {
      unwrap: 'ROOT_LEVEL',
    },
    TEXT_LEVEL: {
      unwrap: 'ROOT_LEVEL',
    },
    LIST_LEVEL: {
    },
    FIGURE_LEVEL: {
    },
  };

  tags: Tags = {
    __ROOT: {
      level: 'EDITOR_LEVEL',
      insideLevel: 'ROOT_LEVEL',
    },
    __TEXT: {
      level: 'FORMATED_TEXT_LEVEL',
      insideLevel: false,
    },
    P: {
      level: 'ROOT_LEVEL',
      insideLevel: 'FORMATED_TEXT_LEVEL',
    },
    H2: {
      level: 'ROOT_LEVEL',
      insideLevel: 'FORMATED_TEXT_LEVEL',
    },
    HR: {
      level: 'ROOT_LEVEL',
      insideLevel: false,
    },
    BR: {
      level: 'FORMATED_TEXT_LEVEL',
      insideLevel: false,
    },
    B: {
      replaceWith: 'STRONG',
      level: 'FORMATED_TEXT_LEVEL',
      insideLevel: 'FORMATED_TEXT_LEVEL',
    },
    STRONG: {
      level: 'FORMATED_TEXT_LEVEL',
      insideLevel: 'FORMATED_TEXT_LEVEL',
    },
    I: {
      level: 'FORMATED_TEXT_LEVEL',
      insideLevel: 'FORMATED_TEXT_LEVEL',
    },
    OL: {
      level: 'ROOT_LEVEL',
      insideLevel: 'LIST_LEVEL',
    },
    UL: {
      level: 'ROOT_LEVEL',
      insideLevel: 'LIST_LEVEL',
    },
    LI: {
      level: 'LIST_LEVEL',
      insideLevel: 'FORMATED_TEXT_LEVEL',
    },
    FIGURE: {
      level: 'ROOT_LEVEL',
      insideLevel: 'FIGURE_LEVEL',
    },
    IMG: {
      level: 'FIGURE_LEVEL',
      insideLevel: false,
    },
  };

  constructor(private editor: ElementHelper, private logger: ArenaLogger) {
  }

  public registerTag(tagName: string, tag: Tag): void {
    this.tags[tagName] = tag;
  }

  public prepareAndPasteText(text: string, forcePaste = false): boolean {
    const focusElement = utils.getFocusElement();
    this.logger.log('prepareAndPasteText', focusElement);
    if (!focusElement) {
      return false;
    }
    const textTag = this.getTextTag();
    if (textTag === false) {
      return false;
    }
    const parentTag = this.getTag(focusElement);
    if (parentTag === false) {
      return false;
    }
    const forLevel = parentTag.insideLevel;
    if (forLevel === false) {
      return false;
    }
    if (forLevel === textTag.level) {
      if (forcePaste) {
        document.execCommand('insertText', false, text);
      }
      return true;
    }
    const raiseTag = this.levels[forLevel]?.raiseTags?.FORMATED_TEXT_LEVEL;
    if (raiseTag) {
      const wrapper = document.createElement(raiseTag);
      wrapper.textContent = text;
      this.logger.warn(`"${wrapper.outerHTML}" input text, raise level to ${raiseTag}`);
      document.execCommand('insertHTML', false, wrapper.outerHTML);
      return false;
      // utils.insert(wpapper.outerHTML);
    }
    return false;
  }

  prepareAndPasteHtml(html: string): boolean {
    const focusElement = utils.getFocusElement();
    this.logger.log('focusElement', focusElement);
    if (!focusElement) {
      return false;
    }
    const parentTag = this.getTag(focusElement);
    if (parentTag === false) {
      return false;
    }
    const forLevel = parentTag.insideLevel;
    if (forLevel === false) {
      return false;
    }
    const div = document.createElement('DIV');
    div.innerHTML = html;
    this.logger.log('parse', div.innerHTML);
    const resultLevel = this.parse(div, forLevel, true);
    if (typeof resultLevel === 'string') {
      const parent = focusElement.parentElement;
      if (!parent) {
        return;
      }
      if (focusElement.nextElementSibling) {
        Array.from(div.children).forEach((element) => {
          parent.insertBefore(element, focusElement.nextElementSibling);
        });
      } else {
        Array.from(div.children).forEach((element) => {
          parent.append(element);
        });
      }
    }
    this.logger.log('parsed', div.innerHTML);
    this.logger.log('resultLevel', resultLevel, forLevel);
    // document.execCommand('insertHTML', false, div.innerHTML);

    return true;
  }

  getFilterXSS(): FilterXSS {
    if (!this.filterXSS) {
      this.filterXSS = new FilterXSS({
        escapeHtml: (html) => html,
        stripIgnoreTag: false,
        stripIgnoreTagBody: ['script'],
        allowCommentTag: false,
        stripBlankChar: true,
        css: true,
        whiteList: {
          h1: [],
          h2: [],
          h3: [],
          h4: [],
          h5: [],
          h6: [],
          b: [],
          strong: [],
          i: [],
          u: [],
          p: ['class', 'slot'],
          br: [],
          hr: [],
          div: ['contenteditable', 'class'],
          a: ['href', 'target'],
          ol: [],
          ul: [],
          li: [],
        },
      });
    }
    return this.filterXSS;
  }

  xss(html: string): string {
    return this.getFilterXSS().process(html);
  }

  prepare(html: string, forLevel: string): string {
    const stripedHtml = this.xss(html);
    const elem = document.createElement('DIV');
    this.logger.log(stripedHtml);
    elem.innerHTML = stripedHtml;
    this.parse(elem, forLevel);
    return elem.innerHTML;
  }

  insert(html: string, silent = false): string {
    const preparedHtml = this.prepare(html, 'ROOT_LEVEL');
    this.logger.log(preparedHtml);
    if (silent) {
      this.editor.setInnerHTML(preparedHtml);
    } else {
      document.execCommand('insertHTML', false, preparedHtml);
    }
    return html;
  }

  getTagByName(tagName: string): Tag | false {
    if (this.tags[tagName]) {
      return this.tags[tagName];
    }
    return false;
  }

  getTag(elem: Element | Text): Tag | false {
    let tagName = '__TEXT';
    if (elem === this.editor.getElem()) {
      tagName = '__ROOT';
    } else if (elem.nodeType !== Node.TEXT_NODE) {
      tagName = (elem as Element).tagName;
    }
    return this.getTagByName(tagName);
  }

  getTextTag(): Tag | false {
    return this.getTagByName('__TEXT');
  }

  parseChildren(elem: Element, tag: Tag): void {
    if (tag.insideLevel === false) {
      this.logger.error('\tremove children');
      elem.childNodes.forEach((someNode: ChildNode) => someNode.remove());
    } else {
      this.logger.log('\tparse children', tag.insideLevel);
      this.parse(elem, tag.insideLevel);
      this.logger.log('\tend parse children', tag.insideLevel);
    }
  }

  parseText(elem: Text, forLevel: string): boolean {
    const tag = this.getTag(elem as Text);
    if (tag === false) {
      this.logger.error(`"${elem.textContent}" - text node is not allowed`, elem);
      elem.remove();
      return false;
    }
    if (tag.level !== forLevel) {
      const raiseTag = this.levels[forLevel]?.raiseTags?.FORMATED_TEXT_LEVEL;
      if (raiseTag) {
        this.logger.warn(`"${elem.textContent}" - text node, raise level to ${raiseTag}`);
        wrapElem(elem, raiseTag);
      } else {
        this.logger.error(`"${elem.textContent}" - text node, cant wrap`, elem);
        elem.remove();
      }
      return false;
    }
    this.logger.info(`"${elem.textContent}" - text node, ok`);
    return true;
  }

  parseElement(
    elem: Element,
    forLevel: string,
    parent: Element,
    canRaiseLevel = false,
  ): boolean | string {
    const tag = this.getTag(elem as Element);
    if (tag === false) {
      this.logger.warn(`${elem.tagName} unaccepted node tag name - unwrap`, elem);
      upwrapElem(elem, parent);
      return false;
    }
    if (tag.replaceWith) {
      rewrapElem(elem, tag.replaceWith);
      return false;
    }
    if (forLevel !== tag.level) {
      const raiseTag = this.levels[forLevel]?.raiseTags?.FORMATED_TEXT_LEVEL;
      if (raiseTag) {
        this.logger.warn(`${elem.tagName} wrap by ${raiseTag}`, elem);
        wrapElem(elem, raiseTag);
      } else {
        if (canRaiseLevel) {
          this.logger.warn(`${elem.tagName} require level ${tag.level}, given ${forLevel} - raise level`, elem);
          return tag.level;
        }
        this.logger.warn(`${elem.tagName} require level ${tag.level}, given ${forLevel} - unwrap`, elem);
        upwrapElem(elem, parent);
      }
      return false;
    }
    this.logger.info(`${elem.tagName} ok`, elem);
    this.parseChildren(elem, tag);
    return true;
  }

  checkElement(elem: Element): void {
    let target = elem;
    if (elem !== this.editor.getElem()) {
      target = elem.parentElement || elem;
    }
    const tag = this.getTag(target);
    if (tag && tag.insideLevel) {
      this.parse(target, tag.insideLevel);
    }
  }

  parse(node: Element, forLevel: string, canRaiseLevel = false): true | string {
    this.logger.log(`LEVEL ${forLevel}`);
    let i = 0;
    while (node.childNodes.length > i) {
      const childNode = node.childNodes[i];
      i += 1;
      if (childNode.nodeType === Node.TEXT_NODE) {
        if (!this.parseText(childNode as Text, forLevel)) {
          i -= 1;
        }
      } else if (childNode.nodeType === Node.ELEMENT_NODE) {
        const result = this.parseElement(childNode as Element, forLevel, node, canRaiseLevel);
        if (result === false) {
          i -= 1;
        } else if (typeof result === 'string') {
          return result;
        }
      } else {
        this.logger.error('unaccepted node type, remove', childNode);
        childNode.remove();
        i -= 1;
      }
    }
    return true;
  }
}
