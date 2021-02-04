import ArenaFormatings from 'ArenaFormatings';
import ArenaNodeAncestorInterface from 'interfaces/ArenaNodeAncestorInterface';
import { ArenaWithRichText } from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import TextNode from './TextNode';

export default class RichNode extends TextNode implements ArenaNodeInterface {
  formatings = new ArenaFormatings();

  constructor(
    public arena: ArenaWithRichText,
    public parent: ArenaNodeAncestorInterface,
  ) {
    super(arena, parent);
  }

  insertFormating(name: string, start: number, end: number): void {
    this.formatings.insertFormating(name, start, end);
  }

  // TODO shift formatings while insert text
}
