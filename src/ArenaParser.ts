/* eslint-disable no-console */
import { FilterXSS } from 'xss';
import ElementHelper from 'ElementHelper';
import ArenaLogger from 'ArenaLogger';
import Arena, { ArenaWithText, ArenaWithRichText } from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import RootNode from 'models/RootNode';
import RichTextManager from 'RichTextManager';
import { TemplateResult, html } from 'lit-html';

type TagAndAttributes = {
  tag: string,
  attributes: string[],
};

type ArenaFormating = {
  name: string,
  tag: string,
  attributes: string[],
};

type ArenaMark = {
  attributes: string[],
  arena: Arena,
};

type FormatingMark = {
  attributes: string[],
  formating: ArenaFormating
};

export default class ArenaParser {
  static rootArenaName = '__ROOT__';

  private filterXSS: FilterXSS | undefined;

  arenas: Arena[] = [];

  arenasByName: { [name: string]: Arena } = { };

  formatings: ArenaFormating[] = [];

  areanMarks: { [tag: string]: ArenaMark[] } = { };

  formatingMarks: { [tag: string]: FormatingMark[] } = { };

  rootArena: Arena;

  model: RootNode;

  constructor(private editor: ElementHelper, private logger: ArenaLogger) {
    const paragraph: ArenaWithRichText = {
      name: 'paragraph',
      tag: 'P',
      template: (child: TemplateResult | string, id: string) => html`<p observe-id="${id}">${child}</p>`,
      attributes: [],
      allowText: true,
      allowFormating: true,
    };
    this.rootArena = {
      name: ArenaParser.rootArenaName,
      tag: '',
      template: (child: TemplateResult | string) => child,
      attributes: [],
      arenaForText: paragraph,
      allowedArenas: [
      ],
    };
    this.registerArena(
      this.rootArena,
      [],
      [],
    );
    this.registerArena(
      paragraph,
      [
        {
          tag: 'P',
          attributes: [],
        },
        {
          tag: 'DIV',
          attributes: [],
        },
      ],
      [ArenaParser.rootArenaName],
    );
    this.model = new RootNode(this.rootArena);
  }

  public registerArena(
    arena: Arena,
    markers: TagAndAttributes[],
    parentArenas: string[],
  ): void {
    this.arenas.push(arena);
    this.arenasByName[arena.name] = arena;
    parentArenas.forEach((parentName) => {
      const parentArena = this.arenasByName[parentName];
      if (parentArena && 'allowedArenas' in parentArena) {
        parentArena.allowedArenas.push(arena);
      }
    });
    markers.forEach(({ tag, attributes }) => {
      if (!this.areanMarks[tag]) {
        this.areanMarks[tag] = [];
      }
      this.areanMarks[tag].push({
        attributes,
        arena,
      });
    });
  }

  public registerFormating(
    formating: ArenaFormating,
    markers: TagAndAttributes[],
  ): void {
    this.formatings.push(formating);
    markers.forEach(({ tag, attributes }) => {
      if (!this.formatingMarks[tag]) {
        this.formatingMarks[tag] = [];
      }
      this.formatingMarks[tag].push({
        attributes,
        formating,
      });
    });
  }

  public insertHtmlToModel(
    htmlString: string,
    arenaNode: ArenaNodeInterface,
    offset: number,
  ): [ArenaNodeInterface, number] {
    const node = document.createElement('DIV');
    node.innerHTML = htmlString;
    return this.insertChildren(node, arenaNode, offset);
  }

  public insertTextToModel(
    text: string,
    arenaNode: ArenaNodeInterface,
    offset: number,
  ): void {
    this.logger.log('atata');
    arenaNode.insertText(text, offset, undefined);
  }

  private insertChildren(
    node: HTMLElement,
    arenaNode: ArenaNodeInterface,
    offset: number,
  ): [ArenaNodeInterface, number] {
    let currentNode = arenaNode;
    let currentOffset = offset;
    node.childNodes.forEach((childNode) => {
      [currentNode, currentOffset] = this.insertChildNode(childNode, currentNode, currentOffset);
    });
    return [currentNode, currentOffset];
  }

  private insertChildNode(
    node: ChildNode,
    arenaNode: ArenaNodeInterface,
    offset: number,
  ): [ArenaNodeInterface, number] {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      this.logger.log('insert text', text);
      return arenaNode.insertText(text, offset, undefined);
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elementNode = node as HTMLElement;
      const arena = this.checkArenaMark(elementNode);
      if (arena) {
        const [
          newArenaNode,
          currentNode,
          currentOffset,
        ] = arenaNode.createAndInsertNode(arena, offset);
        if (newArenaNode) {
          this.insertChildren(elementNode, newArenaNode, 0);
          return [currentNode, currentOffset];
        }
        this.logger.log('this is arena');
        return this.insertChildren(elementNode, arenaNode, offset);
      }
      const formating = this.checkFormatingMark(elementNode);
      if (formating) {
        const formatings = this.getText(elementNode);
        formatings.insertFormating(formating.name, 0, formatings.text.length);
        this.logger.log('this is formating', formatings);
        return arenaNode.insertText(formatings.text, offset, formatings);
      }
      return this.insertChildren(elementNode, arenaNode, offset);
    }
    this.logger.error('unaccepted node type, remove', node);
    return [arenaNode, offset];
  }

  private checkArenaMark(node: HTMLElement): Arena | undefined {
    const marks = this.areanMarks[node.tagName];
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
    const marks = this.formatingMarks[node.tagName];
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
    this.logger.log('aa');
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

  public getText(node: HTMLElement): RichTextManager {
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
        this.logger.error('unaccepted node type, remove', childNode);
      }
      // [currentNode, currentOffset] = this.parseNode(childNode, currentNode, currentOffset);
    });
    return formatings;
  }

  getId(node: Node | HTMLElement): string | undefined {
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

  checkSelection(): false {
    const s = window.getSelection();
    const range = s ? s.getRangeAt(0) : undefined;
    const isCollapsed = s && s.isCollapsed;
    if (isCollapsed) {
      return false;
    }
    if (range) {
      const startId = this.getId(range.startContainer);
    }
    return false;
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
}
