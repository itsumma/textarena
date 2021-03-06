import { FilterXSS } from 'xss';
import Arena from 'interfaces/Arena';
import ArenaNode from 'interfaces/ArenaNode';
import RichTextManager from 'RichTextManager';
import Textarena from 'Textarena';
import { ArenaFormating } from 'ArenaModel';

export default class ArenaParser {
  private filterXSS: FilterXSS | undefined;

  constructor(private textarena: Textarena) {
  }

  public insertHtmlToRoot(
    htmlString: string,
  ): void {
    this.textarena.logger.log(htmlString);
    this.insertHtmlToModel(
      htmlString,
      this.textarena.model.model,
      0,
    );
  }

  public insertHtmlToModel(
    htmlString: string,
    arenaNode: ArenaNode,
    offset: number,
  ): [ArenaNode, number] | undefined {
    const node = document.createElement('DIV');
    node.innerHTML = htmlString;
    return this.insertChildren(node, arenaNode, offset);
  }

  private insertChildren(
    node: HTMLElement,
    arenaNode: ArenaNode,
    offset: number,
  ): [ArenaNode, number] | undefined {
    let currentNode = arenaNode;
    let currentOffset = offset;
    let firstTextNode = true;
    node.childNodes.forEach((childNode, i) => {
      const result = this.insertChildNode(
        childNode,
        currentNode,
        currentOffset,
        firstTextNode,
        i === 0,
        i === node.childNodes.length - 1,
      );

      if (result) {
        [currentNode, currentOffset] = result;
        if (result[2] && firstTextNode) {
          firstTextNode = false;
        }
      } else {
        return undefined;
      }
    });
    return [currentNode, currentOffset];
  }

  private insertChildNode(
    node: ChildNode,
    arenaNode: ArenaNode,
    offset: number,
    firstTextNode: boolean,
    first: boolean,
    last: boolean,
  ): [ArenaNode, number, boolean] | undefined {
    console.log('isert', node, arenaNode);
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent || '';
      const dontInsertEmptyString = first || last || !('hasText' in arenaNode);
      console.log('test', dontInsertEmptyString, text, /^[\s\n]*$/.test(text));
      // TODO except char 160
      if (dontInsertEmptyString && /^[\s\n]*$/.test(text)) {
        return [arenaNode, offset, false];
      }
      if (first) {
        text = text.replace(/^[\s\n]+/, '');
      }
      if (last) {
        text = text.replace(/[\s\n]+$/, '');
      }
      this.textarena.logger.log('insert text', text);
      const result = arenaNode.insertText(text, offset);
      if (result) {
        return [...result, true];
      }
      return undefined;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elementNode = node as HTMLElement;
      const arena = this.checkArenaMark(elementNode);
      if (arena) {
        // TODO check if arena for text
        if ('hasText' in arenaNode && firstTextNode) {
          const result = this.insertChildren(elementNode, arenaNode, offset);
          if (result) {
            return [...result, true];
          }
          return undefined;
        }
        const result = arenaNode.createAndInsertNode(arena, offset);
        if (result) {
          const [
            newArenaNode,
            currentNode,
            currentOffset,
          ] = result;
          if (newArenaNode) {
            this.insertChildren(elementNode, newArenaNode, 0);
            return [currentNode, currentOffset, true];
          }
        }
        this.textarena.logger.log('this is arena');
        const res = this.insertChildren(elementNode, arenaNode, offset);
        if (res) {
          return [...res, true];
        }
        return undefined;
      }
      const formating = this.checkFormatingMark(elementNode);
      if (formating) {
        const formatings = this.getText(elementNode);
        formatings.insertFormating(formating.name, 0, formatings.getTextLength());
        this.textarena.logger.log('this is formating', formatings);
        const res = arenaNode.insertText(formatings, offset);
        if (res) {
          return [...res, true];
        }
        return undefined;
      }
      const res = this.insertChildren(elementNode, arenaNode, offset);
      if (res) {
        return [...res, true];
      }
      return undefined;
    }
    return [arenaNode, offset, false];
  }

  private checkArenaMark(node: HTMLElement): Arena | undefined {
    const marks = this.textarena.model.getArenaMarks(node.tagName);
    if (marks) {
      for (let i = 0; i < marks.length; i += 1) {
        const mark = marks[i];
        if (this.checkAttributes(node, mark.attributes)) {
          return mark.arena;
        }
      }
    }
    return undefined;
  }

  private checkFormatingMark(node: HTMLElement): ArenaFormating | undefined {
    const marks = this.textarena.model.getFormatingMarks(node.tagName);
    if (marks) {
      for (let i = 0; i < marks.length; i += 1) {
        const mark = marks[i];
        if (this.checkAttributes(node, mark.attributes)) {
          return mark.formating;
        }
      }
    }
    return undefined;
  }

  private checkAttributes(node: HTMLElement, attributes: string[]): boolean {
    if (attributes.length === 0) {
      return true;
    }
    for (let i = 0; i < attributes.length; i += 1) {
      const attribute = attributes[i];
      const [name, value] = attribute.split('=');
      if (name === 'style') {
        const [styleName, styleValue] = value.split(':');
        if (styleName in node.style
          && node.style[styleName] === styleValue.trim().toLowerCase()) {
          return true;
        }
      }
      // TODO more
    }
    return false;
  }

  private getText(node: HTMLElement): RichTextManager {
    const formatings = new RichTextManager();
    let offset = 0;
    node.childNodes.forEach((childNode) => {
      if (childNode.nodeType === Node.TEXT_NODE) {
        offset = formatings.insertText(childNode.textContent || '', offset);
      } else if (childNode.nodeType === Node.ELEMENT_NODE) {
        const elementNode = childNode as HTMLElement;
        const newFormatings = this.getText(elementNode);
        const formating = this.checkFormatingMark(elementNode);
        if (formating) {
          newFormatings.insertFormating(formating.name, 0, newFormatings.getTextLength());
        }
        offset = formatings.insertText(newFormatings, offset);
      } else {
        this.textarena.logger.error('unaccepted node type, remove', childNode);
      }
      // [currentNode, currentOffset] = this.parseNode(childNode, currentNode, currentOffset);
    });
    return formatings;
  }

  getFilterXSS(): FilterXSS {
    if (!this.filterXSS) {
      this.filterXSS = new FilterXSS({
        escapeHtml: (htmlString) => htmlString,
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

  xss(htmlString: string): string {
    return this.getFilterXSS().process(htmlString);
  }
}
