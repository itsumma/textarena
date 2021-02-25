/* eslint-disable no-console */
import { FilterXSS } from 'xss';
import Arena from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
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
    this.insertHtmlToModel(
      htmlString,
      this.textarena.model.model,
      0,
    );
  }

  public insertHtmlToModel(
    htmlString: string,
    arenaNode: ArenaNodeInterface,
    offset: number,
  ): [ArenaNodeInterface, number] | undefined {
    const node = document.createElement('DIV');
    node.innerHTML = htmlString;
    return this.insertChildren(node, arenaNode, offset);
  }

  public insertTextToModel(
    text: string,
    arenaNode: ArenaNodeInterface,
    offset: number,
  ): void {
    this.textarena.logger.log('atata');
    arenaNode.insertText(text, offset, undefined);
  }

  private insertChildren(
    node: HTMLElement,
    arenaNode: ArenaNodeInterface,
    offset: number,
  ): [ArenaNodeInterface, number] | undefined {
    let currentNode = arenaNode;
    let currentOffset = offset;
    node.childNodes.forEach((childNode) => {
      const result = this.insertChildNode(childNode, currentNode, currentOffset);
      if (result) {
        [currentNode, currentOffset] = result;
      } else {
        return undefined;
      }
    });
    return [currentNode, currentOffset];
  }

  private insertChildNode(
    node: ChildNode,
    arenaNode: ArenaNodeInterface,
    offset: number,
  ): [ArenaNodeInterface, number] | undefined {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      this.textarena.logger.log('insert text', text);
      return arenaNode.insertText(text, offset, undefined);
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elementNode = node as HTMLElement;
      const arena = this.checkArenaMark(elementNode);
      if (arena) {
        const result = arenaNode.createAndInsertNode(arena, offset);
        if (result) {
          const [
            newArenaNode,
            currentNode,
            currentOffset,
          ] = result;
          if (newArenaNode) {
            this.insertChildren(elementNode, newArenaNode, 0);
            return [currentNode, currentOffset];
          }
        }
        this.textarena.logger.log('this is arena');
        return this.insertChildren(elementNode, arenaNode, offset);
      }
      const formating = this.checkFormatingMark(elementNode);
      if (formating) {
        const formatings = this.getText(elementNode);
        formatings.insertFormating(formating.name, 0, formatings.text.length);
        this.textarena.logger.log('this is formating', formatings);
        return arenaNode.insertText(formatings.text, offset, formatings);
      }
      return this.insertChildren(elementNode, arenaNode, offset);
    }
    this.textarena.logger.error('unaccepted node type, remove', node);
    return [arenaNode, offset];
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
    this.textarena.logger.log('aa');
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
        offset = formatings.insertText(childNode.textContent || '', offset, undefined);
      } else if (childNode.nodeType === Node.ELEMENT_NODE) {
        const elementNode = childNode as HTMLElement;
        const newFormatings = this.getText(elementNode);
        const formating = this.checkFormatingMark(elementNode);
        if (formating) {
          newFormatings.insertFormating(formating.name, 0, newFormatings.text.length);
        }
        offset = formatings.insertText(newFormatings.text, offset, newFormatings);
      } else {
        this.textarena.logger.error('unaccepted node type, remove', childNode);
      }
      // [currentNode, currentOffset] = this.parseNode(childNode, currentNode, currentOffset);
    });
    return formatings;
  }

  private getId(node: Node | HTMLElement): string | undefined {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elementNode = node as HTMLElement;
      const id = elementNode.getAttribute('observe-id');
      if (id) {
        return id;
      }
    }
    if (node.parentElement) {
      return this.getId(node.parentElement);
    }
    return undefined;
  }

  public getSelectionModel(): false {
    const s = window.getSelection();
    const range = s ? s.getRangeAt(0) : undefined;
    const isCollapsed = s && s.isCollapsed;
    if (isCollapsed) {
      return false;
    }
    if (range) {
      const startId = this.getId(range.startContainer);
      const endId = this.getId(range.startContainer);
      if (startId && endId) {
        const startModel = this.textarena.model.getModelById(startId);
        const endModel = this.textarena.model.getModelById(endId);
      }
    }
    return false;
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
