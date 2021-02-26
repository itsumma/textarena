import { TemplateResult, html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import ArenaNodeCore from 'interfaces/ArenaNodeCore';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import RichTextManager from 'RichTextManager';
import AbstractNodeText from './AbstractNodeText';

export default class RichNode
  extends AbstractNodeText
  implements ArenaNodeText {
  richTextManager = new RichTextManager();

  insertText(
    text: string,
    offset: number,
    formatings?: RichTextManager,
  ): [ArenaNodeCore, number] | undefined {
    return [this, this.richTextManager.insertText(text, offset, formatings)];
  }

  getText(): TemplateResult | string {
    return html`
      ${unsafeHTML(this.richTextManager.getHtml())}
    `;
  }

  removeText(start: number, end?: number): void {
    this.richTextManager.removeText(start, end);
  }
}
