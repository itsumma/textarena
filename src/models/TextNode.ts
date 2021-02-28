import { TemplateResult } from 'lit-html';
import Arena from 'interfaces/Arena';
import ArenaNodeCore from 'interfaces/ArenaNodeCore';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import AbstractNodeText from './AbstractNodeText';

export default class TextNode
  extends AbstractNodeText
  implements ArenaNodeText {
  protected text = '';

  getIndex(): number {
    return this.parent.children.indexOf(this);
  }

  getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  createAndInsertNode(arena: Arena): [
    ArenaNodeCore, ArenaNodeCore, number,
  ] | undefined {
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  }

  insertText(
    text: string,
    offset = 0,
  ): [ArenaNodeCore, number] | undefined {
    this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
    return [this, offset + text.length];
  }

  getText(): string {
    return this.text;
  }

  getTemplate(): TemplateResult | string {
    return this.getText();
  }

  getHtml(): TemplateResult | string {
    console.log('getHtml', this, this.getTemplate());
    return this.arena.template(this.getTemplate(), this.getGlobalIndex());
  }

  removeText(start: number, end?: number): void {
    if (end === undefined) {
      this.text = this.text.slice(0, start);
    } else {
      this.text = this.text.slice(0, start) + this.text.slice(end);
    }
  }

  getTextLength(): number {
    return this.text.length;
  }

  remove(): void {
    this.parent.removeChild(this.getIndex());
  }
}
