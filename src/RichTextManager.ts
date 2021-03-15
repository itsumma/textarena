/* eslint-disable no-lonely-if */
import ArenaModel, { ArenaFormatings } from 'ArenaModel';
import Intervaler from 'Intervaler';

export type Formatings = {
  [name: string]: Intervaler
};

type Insertion = {
  tag: string,
  offset: number,
};

export default class RichTextManager {
  constructor(text?: string, formatings?: Formatings) {
    this.text = text || '';
    this.formatings = formatings || {};
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

  public getHtml(model: ArenaModel): string {
    const { text } = this;
    if (text === '') {
      return '<br/>';
    }
    const frms = model.getFormatings();
    // FIXME nesting formatings
    let index = 0;
    let result = '';
    let lastSpace = false;
    this.getInsertions(frms).forEach((insertion) => {
      let prepared = this.prepareText(
        text.slice(index, insertion.offset),
        index === 0,
        insertion.offset === text.length,
      );
      if (lastSpace) {
        prepared = prepared.replace(/^\s/, '&nbsp;');
      }
      lastSpace = prepared.slice(-1) === ' ';
      result += prepared
        + insertion.tag;
      index = insertion.offset;
    });
    let prepared = this.prepareText(text.slice(index), index === 0, true);
    if (lastSpace) {
      prepared = prepared.replace(/^\s/, '&nbsp;');
    }
    result += prepared;
    return result;
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
        intervaler.getIntervals().forEach((interval) => {
          insertions.push({
            offset: interval.start,
            tag: `<${tag}>`,
          });
          insertions.push({
            offset: interval.end,
            tag: `</${tag}>`,
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
}
