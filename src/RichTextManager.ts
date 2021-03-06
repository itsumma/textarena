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
  protected formatings: Formatings;

  protected text: string;

  constructor(text?: string, formatings?: Formatings) {
    this.text = text || '';
    this.formatings = formatings || {};
  }

  getText(): string {
    return this.text;
  }

  getFormatings(): Formatings {
    return this.formatings;
  }

  getTextLength(): number {
    return this.text.length;
  }

  cutText(start: number, end?: number): RichTextManager {
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

  insertFormating(name: string, start: number, end: number): void {
    if (!this.formatings[name]) {
      this.formatings[name] = new Intervaler();
    }
    this.formatings[name].addInterval(start, end);
  }

  toggleFormating(name: string, start: number, end: number): void {
    if (!this.formatings[name]) {
      this.formatings[name] = new Intervaler();
      this.formatings[name].addInterval(start, end);
    } else {
      if (this.formatings[name].hasInterval(start, end)) {
        this.formatings[name].cut(start, end);
      } else {
        this.formatings[name].addInterval(start, end);
      }
    }
  }

  shiftFormatings(offset: number, step: number, keepFormatings = false): void {
    Object.values(this.formatings)
      .forEach((intervaler) => intervaler.shift(offset, step, keepFormatings));
  }

  cutFormatings(offset: number, length?: number): Formatings {
    const formatings: Formatings = {};
    Object.entries(this.formatings).forEach(([name, intervaler]) => {
      console.log('cut intrvls', name, offset, length);
      formatings[name] = intervaler.cut(offset, length);
    });
    return formatings;
  }

  merge(formatings: RichTextManager, offset: number): void {
    Object.entries(formatings.formatings).forEach(([name, intervaler]) => {
      if (!this.formatings[name]) {
        this.formatings[name] = new Intervaler();
      }
      this.formatings[name].merge(intervaler, offset);
    });
  }

  insertText(
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

  getInsertions(frms: ArenaFormatings): Insertion[] {
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
    return insertions.sort((a, b) => b.offset - a.offset);
  }

  getHtml(model: ArenaModel): string {
    let { text } = this;
    if (text === '') {
      return '<br/>';
    }
    const frms = model.getFormatings();
    // TODO escape text
    // FIXME nesting formatings
    this.getInsertions(frms).forEach((insertion) => {
      text = text.slice(0, insertion.offset) + insertion.tag + text.slice(insertion.offset);
    });
    return text;
  }

  removeText(start: number, end?: number): void {
    if (end === undefined) {
      this.text = this.text.slice(0, start);
    } else {
      this.text = this.text.slice(0, start) + this.text.slice(end);
    }
    this.cutFormatings(start, end ? end - start : undefined);
  }
}
