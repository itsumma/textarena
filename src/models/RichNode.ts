import ArenaFormatings from 'ArenaFormatings';
import ArenaModel from 'interfaces/ArenaModel';
import TextNode from './TextNode';

export default class RichText extends TextNode implements ArenaModel {
  formatings = new ArenaFormatings();

  insertFormating(name: string, start: number, end: number): void {
    this.formatings.insertFormating(name, start, end);
  }

  // TODO shift formatings while insert text
}
