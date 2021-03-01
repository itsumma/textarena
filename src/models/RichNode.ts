import { TemplateResult, html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import RichTextManager from 'RichTextManager';
import AbstractNodeText from './AbstractNodeText';

export default class RichNode
  extends AbstractNodeText
  implements ArenaNodeText {
  richTextManager = new RichTextManager();

  insertText(
    text: string | RichTextManager,
    offset: number,
  ): [ArenaNode, number] | undefined {
    return [this, this.richTextManager.insertText(text, offset)];
  }

  getTemplate(): TemplateResult | string {
    return html`
      ${unsafeHTML(this.richTextManager.getHtml())}
    `;
  }

  getText(): string {
    return this.richTextManager.getText();
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
