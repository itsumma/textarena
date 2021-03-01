import { TemplateResult } from 'lit-html';
import RichTextManager from 'RichTextManager';
import Arena from 'interfaces/Arena';
import ArenaNode from 'interfaces/ArenaNode';
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
    ArenaNode, ArenaNode, number,
  ] | undefined {
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  }

  insertText(
    text: string | RichTextManager,
    offset = 0,
  ): [ArenaNode, number] | undefined {
    const textStr = typeof text === 'string' ? text : text.getText();
    this.text = this.text.slice(0, offset) + textStr + this.text.slice(offset);
    return [this, offset + textStr.length];
  }

  getText(): string | RichTextManager {
    return this.text;
  }

  cutText(start: number, end?: number): string {
    let result;
    if (end === undefined) {
      result = this.text.slice(start);
      this.text = this.text.slice(0, start);
    } else {
      result = this.text.slice(start, end);
      this.text = this.text.slice(0, start) + this.text.slice(end);
    }
    return result;
  }

  getTemplate(): TemplateResult | string {
    return this.getText() as string;
  }

  getHtml(): TemplateResult | string {
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
