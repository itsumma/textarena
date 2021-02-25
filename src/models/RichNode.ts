import { TemplateResult, html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import RichTextManager from 'RichTextManager';
import Arena from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import ScionNodeAbstract from './ScionNodeAbstract';

export default class RichNode
  extends ScionNodeAbstract {
  richTextManager = new RichTextManager();

  insertText(
    text: string,
    offset: number,
    formatings?: RichTextManager,
  ): [ArenaNodeInterface, number] | undefined {
    return [this, this.richTextManager.insertText(text, offset, formatings)];
  }

  createAndInsertNode(arena: Arena): [
    ArenaNodeInterface, ArenaNodeInterface, number,
  ] | undefined {
    return this.parent.createAndInsertNode(arena, this.getMyIndex() + 1);
  }

  getText(): TemplateResult | string {
    return html`
      ${unsafeHTML(this.richTextManager.getHtml())}
    `;
  }

  getHtml(): TemplateResult | string {
    return this.arena.template(this.getText(), this.getGlobalIndex());
  }
}
