import Intervaler from 'Intervaler';

type Formatings = {
  [name: string]: Intervaler
};

type Insertion = {
  tag: string,
  offset: number,
};

export default class RichTextManager {
  private formatings: Formatings = { };

  text = '';

  getText(): string {
    return this.text;
  }

  insertFormating(name: string, start: number, end: number): void {
    if (!this.formatings[name]) {
      this.formatings[name] = new Intervaler();
    }
    this.formatings[name].addInterval(start, end);
  }

  shiftFormatings(offset: number, step: number): void {
    Object.values(this.formatings).forEach((intervaler) => intervaler.shift(offset, step));
  }

  cutFormatings(offset: number, length?: number): void {
    Object.values(this.formatings).forEach((intervaler) => intervaler.cut(offset, length));
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
    text: string,
    offset = 0,
    formatings?: RichTextManager,
  ): number {
    this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
    this.shiftFormatings(offset, text.length);
    if (formatings) {
      this.merge(formatings, offset);
    }
    return offset + text.length;
  }

  getInsertions(): Insertion[] {
    const insertions: Insertion[] = [];
    Object.entries(this.formatings).forEach(([name, intervaler]) => {
      const tag = name === 'italic' ? 'em' : 'strong'; // FIXME
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
    });
    return insertions.sort((a, b) => b.offset - a.offset);
  }

  getHtml(): string {
    let { text } = this;
    this.getInsertions().forEach((insertion) => {
      text = text.slice(0, insertion.offset) + insertion.tag + text.slice(insertion.offset);
    });
    console.log(text);
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
