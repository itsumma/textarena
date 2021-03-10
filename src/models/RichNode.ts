import { TemplateResult, html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import Arena from 'interfaces/Arena';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import ArenaModel from 'ArenaModel';
import RichTextManager from 'RichTextManager';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import ArenaCursor from 'interfaces/ArenaCursor';
import ArenaCursorAncestor from 'interfaces/ArenaCursorAncestor';
import ArenaWithText from 'interfaces/ArenaWithText';

export default class RichNode implements ArenaNodeText {
  readonly hasParent: true = true;

  readonly hasText: true = true;

  private richTextManager = new RichTextManager();

  constructor(
    public arena: ArenaWithText,
    public parent: ArenaNodeAncestor,
  ) {
  }

  public getIndex(): number {
    return this.parent.children.indexOf(this);
  }

  public getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  public getUnprotectedParent(): ArenaCursorAncestor {
    if (this.parent.arena.protected) {
      return this.parent.getUnprotectedParent();
    }
    return { node: this.parent, offset: this.getIndex() };
  }

  public remove(): void {
    this.parent.removeChild(this.getIndex());
  }

  getTextCursor(index: number): ArenaCursor {
    return {
      node: this,
      offset: index === -1 ? this.getTextLength() : index,
    };
  }

  public createAndInsertNode(arena: Arena): ArenaNodeScion | ArenaNodeText | undefined {
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  }

  public insertText(
    text: string | RichTextManager,
    offset: number,
    keepFormatings = false,
  ): ArenaCursor {
    return {
      node: this,
      offset: this.richTextManager.insertText(text, offset, keepFormatings),
    };
  }

  public insertFormating(name: string, start: number, end: number): void {
    this.richTextManager.insertFormating(name, start, end);
  }

  public toggleFormating(name: string, start: number, end: number): void {
    this.richTextManager.toggleFormating(name, start, end);
  }

  protected getTemplate(model: ArenaModel): TemplateResult | string {
    const content = this.richTextManager.getHtml(model);
    return html`
      ${unsafeHTML(content)}
    `;
  }

  public getHtml(model: ArenaModel): TemplateResult | string {
    return this.arena.getTemplate(this.getTemplate(model), this.getGlobalIndex());
  }

  public getText(): RichTextManager {
    return this.richTextManager;
  }

  public getRawText(): string {
    return this.richTextManager.getText();
  }

  public cutText(start: number, end?: number): string | RichTextManager {
    return this.richTextManager.cutText(start, end);
  }

  public removeText(start: number, end?: number): void {
    this.richTextManager.removeText(start, end);
  }

  public getTextLength(): number {
    return this.richTextManager.getTextLength();
  }
}
