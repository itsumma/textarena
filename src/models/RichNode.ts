import { TemplateResult, html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import RichTextManager from 'RichTextManager';
import ArenaNodeAncestorInterface from 'interfaces/ArenaNodeAncestorInterface';
import Arena, { ArenaWithRichText } from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';

export default class RichNode implements ArenaNodeInterface {
  richTextManager = new RichTextManager();

  constructor(
    public arena: ArenaWithRichText,
    public parent: ArenaNodeAncestorInterface,
  ) {
  }

  getMyIndex(): number {
    return this.parent.children.indexOf(this);
  }

  insertText(
    text: string,
    offset: number,
    formatings: RichTextManager | undefined,
  ): [ArenaNodeInterface, number] {
    return [this, this.richTextManager.insertText(text, offset, formatings)];
  }

  createAndInsertNode(arena: Arena): [
    ArenaNodeInterface | undefined, ArenaNodeInterface, number,
  ] {
    return this.parent.createAndInsertNode(arena, this.getMyIndex() + 1);
  }

  getHtml(): TemplateResult {
    console.log('rich node', this.arena.tag, this.richTextManager.getHtml());
    return this.arena.template(html`
      ${unsafeHTML(this.richTextManager.getHtml())}
    `);
  }
}
