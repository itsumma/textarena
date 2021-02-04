import ArenaModel, { Arena } from 'interfaces/ArenaModel';

export default class TextNode implements ArenaModel {
  text = '';

  constructor(
    public arena: Arena,
  ) {
  }

  insertText(text: string, offset = 0): number {
    this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
    return offset;
  }
}
