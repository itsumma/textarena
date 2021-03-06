import { TemplateResult, html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import RichTextManager from 'RichTextManager';
import AbstractNodeText from './AbstractNodeText';
import ArenaModel from 'ArenaModel';

export default class RichNode
  extends AbstractNodeText
  implements ArenaNodeText {
  richTextManager = new RichTextManager();

  insertText(
    text: string | RichTextManager,
    offset: number,
    keepFormatings = false,
  ): [ArenaNode, number] | undefined {
    return [this, this.richTextManager.insertText(text, offset, keepFormatings)];
  }

  insertFormating(name: string, start: number, end: number): void {
    this.richTextManager.insertFormating(name, start, end);
  }

  toggleFormating(name: string, start: number, end: number): void {
    this.richTextManager.toggleFormating(name, start, end);
  }

  getTemplate(model: ArenaModel): TemplateResult | string {
    return html`
      ${unsafeHTML(this.richTextManager.getHtml(model))}
    `;
  }

  getText(): string | RichTextManager {
    return this.richTextManager;
  }

  getFormatings(): string {
    return this.richTextManager.getText();
  }

  cutText(start: number, end?: number): string | RichTextManager {
    return this.richTextManager.cutText(start, end);
  }

  removeText(start: number, end?: number): void {
    this.richTextManager.removeText(start, end);
  }

  getTextLength(): number {
    return this.richTextManager.getTextLength();
  }
}
