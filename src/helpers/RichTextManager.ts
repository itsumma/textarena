/* eslint-disable no-lonely-if */
import Intervaler from 'helpers/Intervaler';
import { ArenaFormatings } from 'interfaces/ArenaFormating';
import ArenaInline from 'interfaces/ArenaInline';
import ArenaNodeInline from 'interfaces/ArenaNodeInline';
import InlineNode from 'models/InlineNode';
import InlineIntervaler from './InlineIntervaler';

export type Formatings = {
  [name: string]: Intervaler
};

type InlineNodeInterval = {
  node: ArenaNodeInline,
  start: number,
  end: number,
};

type Insertion = {
  tag: string,
  offset: number,
};

type Interval = {
  start: number,
  end: number,
};

type FNodeTags = {
  name: string,
  openTag: string,
  closeTag: string,
};

type FNode = {
  name: string,
  openTag?: string,
  closeTag?: string,
  start: number,
  end: number,
  children: FNode[],
};

const insertInNodes = (
  nodes: FNode[],
  tags: FNodeTags,
  interval: Interval,
) => {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.start >= interval.end) {
      break;
    }
    if (interval.start < node.end && interval.end > node.start) {
      if (node.name === '') {
        const newNodes = [];
        if (node.start < interval.start) {
          newNodes.push({
            name: '',
            start: node.start,
            end: interval.start,
            children: [],
          });
        }
        newNodes.push({
          ...tags,
          start: Math.max(node.start, interval.start),
          end: Math.min(node.end, interval.end),
          children: [{
            name: '',
            start: Math.max(node.start, interval.start),
            end: Math.min(node.end, interval.end),
            children: [],
          }],
        });
        if (node.end > interval.end) {
          newNodes.push({
            name: '',
            start: interval.end,
            end: node.end,
            children: [],
          });
        }
        nodes.splice(i, 1, ...newNodes);
        i += newNodes.length - 1;
      } else {
        insertInNodes(node.children, tags, interval);
      }
    }
  }
};

export default class RichTextManager {
  constructor(
    text?: string,
    formatings?: Formatings,
    inlines?: InlineIntervaler,
  ) {
    this.text = text || '';
    this.formatings = formatings || {};
    this.inlines = inlines || new InlineIntervaler();
  }

  public getText(): string {
    return this.text;
  }

  public getTextLength(): number {
    return this.text.length;
  }

  public getFormatings(): Formatings {
    return this.formatings;
  }

  public getHtml(frms: ArenaFormatings): string {
    const { text } = this;
    if (text === '') {
      return '<br/>';
    }
    const tree = this.getHtmlTree(frms);
    const [html] = this.getHtmlFromTree(tree);
    return html;
  }

  public insertText(
    rtm: string | RichTextManager,
    offset = 0,
    keepFormatings = false,
  ): number {
    const text = typeof rtm === 'string' ? rtm : rtm.getText();
    this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
    this.shiftFormatings(offset, text.length, keepFormatings);
    if (rtm instanceof RichTextManager) {
      this.merge(rtm, offset);
    }
    return offset + text.length;
  }

  public removeText(start: number, end?: number): void {
    this.cutText(start, end);
  }

  public cutText(start: number, end?: number): RichTextManager {
    let text;
    if (end === undefined) {
      text = this.text.slice(start);
      this.text = this.text.slice(0, start);
    } else {
      text = this.text.slice(start, end);
      this.text = this.text.slice(0, start) + this.text.slice(end);
    }
    const formatings = this.cutFormatings(start, end);
    return new RichTextManager(text, formatings);
  }

  public insertFormating(name: string, start: number, end: number): void {
    if (!this.formatings[name]) {
      this.formatings[name] = new Intervaler();
    }
    this.formatings[name].addInterval(start, end);
  }

  public toggleFormating(name: string, start: number, end: number): void {
    if (!this.formatings[name]) {
      this.formatings[name] = new Intervaler();
      this.formatings[name].addInterval(start, end);
    } else {
      if (this.formatings[name].hasInterval(start, end)) {
        this.formatings[name].removeInterval(start, end);
      } else {
        this.formatings[name].addInterval(start, end);
      }
    }
  }

  public hasFormating(name: string, start?: number, end?: number): boolean {
    if (!this.formatings[name]) {
      return false;
    }
    return this.formatings[name].hasInterval(start || 0, end || this.text.length);
  }

  public ltrim(): void {
    const match = this.text.match(/^( +)/g);
    if (!match) {
      return;
    }
    const len = match[0].length;
    this.cutText(0, len);
  }

  public rtrim(): void {
    const match = this.text.match(/( +)$/g);
    if (!match) {
      return;
    }
    const len = match[0].length;
    const start = this.text.length - len;
    this.cutText(start, start + len);
  }

  public clearSpaces(): void {
    let match;
    // eslint-disable-next-line no-cond-assign
    while (match = / {2,}/.exec(this.text)) {
      const start = match.index;
      const end = start + match[0].length - 1;
      this.cutText(start, end);
    }
  }

  public addInlineNode(
    arena: ArenaInline,
    start: number,
    end: number,
  ): ArenaNodeInline | undefined {
    const node = new InlineNode(arena);
    if (node instanceof InlineNode) {
      this.inlines.addInterval(start, end, node);
      return node;
    }
    return undefined;
  }

  public removeInlineNode(node: ArenaNodeInline): void {
    this.inlines.removeNode(node);
  }

  protected inlines: InlineIntervaler;

  protected formatings: Formatings;

  protected text: string;

  protected cutFormatings(start: number, end?: number): Formatings {
    const formatings: Formatings = {};
    Object.entries(this.formatings).forEach(([name, intervaler]) => {
      formatings[name] = intervaler.cut(start, end);
    });
    return formatings;
  }

  protected prepareText(text: string, first: boolean, last: boolean): string {
    let result = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\s\s/g, ' &nbsp;');
    if (first) {
      result = result.replace(/^\s/, '&nbsp;');
    }
    if (last) {
      result = result.replace(/\s$/, '&nbsp;');
    }
    return result;
  }

  protected getInsertions(frms: ArenaFormatings): Insertion[] {
    const insertions: Insertion[] = [];
    Object.entries(this.formatings).forEach(([name, intervaler]) => {
      if (frms[name]) {
        const { tag, attributes } = frms[name];
        let attributesStr = '';
        attributes.forEach((attr) => {
          attributesStr += ` ${attr}`;
        });
        intervaler.getIntervals().forEach((interval) => {
          insertions.push({
            offset: interval.start,
            tag: `<${tag.toLowerCase()}${attributesStr}>`,
          });
          insertions.push({
            offset: interval.end,
            tag: `</${tag.toLowerCase()}>`,
          });
        });
      }
    });
    return insertions.sort((a, b) => a.offset - b.offset);
  }

  protected shiftFormatings(offset: number, step: number, keepFormatings = false): void {
    Object.values(this.formatings)
      .forEach((intervaler) => intervaler.shift(offset, step, keepFormatings));
  }

  protected merge(formatings: RichTextManager, offset: number): void {
    Object.entries(formatings.formatings).forEach(([name, intervaler]) => {
      if (!this.formatings[name]) {
        this.formatings[name] = new Intervaler();
      }
      this.formatings[name].merge(intervaler, offset);
    });
  }

  protected getHtmlTree(frms: ArenaFormatings): FNode[] {
    const rootNodes: FNode[] = [{
      name: '',
      start: 0,
      end: this.text.length,
      children: [],
    }];

    this.inlines.getIntervals().forEach((obj) => {
      const { node, start, end } = obj;
      const [openTag, closeTag] = node.getTags();
      insertInNodes(
        rootNodes,
        {
          name: node.arena.name,
          openTag,
          closeTag,
        },
        { start, end },
      );
    });

    Object.entries(this.formatings).forEach(([name, intervaler]) => {
      if (frms[name]) {
        const { tag, attributes } = frms[name];
        let attributesStr = '';
        attributes.forEach((attr) => {
          attributesStr += ` ${attr}`;
        });

        intervaler.getIntervals().forEach((interval) => {
          insertInNodes(
            rootNodes,
            {
              name,
              openTag: `<${tag.toLowerCase()}${attributesStr}>`,
              closeTag: `</${tag.toLowerCase()}>`,
            },
            interval,
          );
        });
      }
    });
    return rootNodes;
  }

  protected getHtmlFromTree(nodes: FNode[], prepareSpace = false): [string, boolean] {
    let text = '';
    let lastSpace = prepareSpace;

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (node.name === '') {
        let prepared = this.prepareText(
          this.text.slice(node.start, node.end),
          node.start === 0,
          node.end === this.text.length,
        );
        if (lastSpace) {
          prepared = prepared.replace(/^\s/, '&nbsp;');
        }
        lastSpace = prepared.slice(-1) === ' ';
        text += prepared;
      } else {
        const [childText, childPrepareSpace] = this.getHtmlFromTree(node.children, lastSpace);
        lastSpace = childPrepareSpace;
        text += node.openTag + childText + node.closeTag;
      }
    }
    return [text, lastSpace];
  }
}
