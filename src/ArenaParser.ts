/* eslint-disable no-console */
import { FilterXSS } from 'xss';
import ElementHelper from 'ElementHelper';
import ArenaLogger from 'ArenaLogger';
import Arena from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import RootNode from 'models/RootNode';

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
    const paragraph: Arena = {
      name: 'paragraph',
      tag: 'P',
      attributes: [],
      allowText: true,
      allowFormating: true,
    };
    this.rootArena = {
      name: ArenaParser.rootArenaName,
      tag: '',
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
    html: string,
    arenaNode: ArenaNodeInterface,
    offset: number,
  ): [ArenaNodeInterface, number] {
    const node = document.createElement('DIV');
    node.innerHTML = html;
    return this.insertChildren(node, arenaNode, offset);
  }

  public insertTextToModel(
    text: string,
    arenaNode: ArenaNodeInterface,
    offset: number,
  ): void {
    this.logger.log('atata');
    arenaNode.insertText(text, offset);
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
      return arenaNode.insertText(text, offset);
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
        return this.insertChildren(elementNode, arenaNode, offset);
      }
      const formating = this.checkFormatingMark(elementNode);
      if (formating) {
        // const newNode = NodeFactory.createNode(arena);
        // arenaNode.insertFormating(marker.formating.name, start, end);
        // elementNode.childNodes.forEach((childNode) => {
        //   this.insertChildNode(childNode);
        // });
        // return;
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

  // public getText(node: HTMLElement): [string, Formatings] {
  //   let text = '';
  //   const formatings = new ArenaFormatings();
  //   node.childNodes.forEach((childNode) => {
  //     if (childNode.nodeType === Node.TEXT_NODE) {
  //       text += (childNode.textContent || '');
  //     } else if (childNode.nodeType === Node.ELEMENT_NODE) {
  //       const elementNode = childNode as HTMLElement;
  //       const marker = this.markers[elementNode.tagName];
  //       if (marker) {
  //         if ('formating' in marker) {
  //           formatings.insertFormating(marker.formating.name);
  //           text += this.getText(elementNode);
  //         } else {
  //           text += this.getText(elementNode);
  //         }
  //       } else {
  //         text += this.getText(elementNode);
  //       }
  //     } else {
  //       this.logger.error('unaccepted node type, remove', childNode);
  //     }
  //     // [currentNode, currentOffset] = this.parseNode(childNode, currentNode, currentOffset);
  //   });
  //   return [text, formatings];
  // }

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
