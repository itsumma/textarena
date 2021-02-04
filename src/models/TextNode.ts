import ArenaNodeAncestorInterface from 'interfaces/ArenaNodeAncestorInterface';
import Arena, { ArenaWithText } from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';

export default class TextNode implements ArenaNodeInterface {
  text = '';

  constructor(
    public arena: ArenaWithText,
    public parent: ArenaNodeAncestorInterface,
  ) {
  }

  getMyIndex(): number {
    return this.parent.children.indexOf(this);
  }

  insertText(text: string, offset = 0): [ArenaNodeInterface, number] {
    this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
    return [this, offset + text.length];
  }

  createAndInsertNode(arena: Arena): [
    ArenaNodeInterface | undefined, ArenaNodeInterface, number,
  ] {
    return this.parent.createAndInsertNode(arena, this.getMyIndex() + 1);
  }
}
