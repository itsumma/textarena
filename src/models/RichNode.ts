import { TemplateResult, html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import Arena from 'interfaces/Arena';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import RichTextManager from 'helpers/RichTextManager';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import ArenaCursor from 'interfaces/ArenaCursor';
import ArenaCursorAncestor from 'interfaces/ArenaCursorAncestor';
import ArenaWithText from 'interfaces/ArenaWithText';
import { ArenaFormatings } from 'interfaces/ArenaFormating';
import ArenaNodeInline from 'interfaces/ArenaNodeInline';
import ArenaInline from 'interfaces/ArenaInline';

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

  public isLastChild(): boolean {
    return this.parent.children.indexOf(this) === this.parent.children.length - 1;
  }

  public getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  public getParent(): ArenaCursorAncestor {
    return { node: this.parent, offset: this.getIndex() };
  }

  public setParent(parent: ArenaNodeAncestor | (ArenaNodeAncestor & ArenaNodeScion)): void {
    this.parent = parent;
  }

  public getUnprotectedParent(): ArenaCursorAncestor | undefined {
    if (this.parent.arena.protected) {
      return this.parent.getUnprotectedParent();
    }
    return { node: this.parent, offset: this.getIndex() };
  }

  public remove(): ArenaCursorAncestor {
    return this.parent.removeChild(this.getIndex());
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

  public ltrim(): void {
    this.richTextManager.ltrim();
  }

  public rtrim(): void {
    this.richTextManager.rtrim();
  }

  public clearSpaces(): void {
    this.richTextManager.clearSpaces();
  }

  public toggleFormating(name: string, start: number, end: number): void {
    this.richTextManager.toggleFormating(name, start, end);
  }

  public getHtml(frms: ArenaFormatings): TemplateResult | string {
    const content = this.richTextManager.getHtml(frms);
    return this.arena.getTemplate(
      html`${unsafeHTML(content)}`,
      this.getGlobalIndex(),
    );
  }

  public getOutputHtml(frms: ArenaFormatings, deep: number): string {
    const text = this.richTextManager.getHtml(frms);
    return this.arena.getOutputTemplate(text, deep);
  }

  public getText(): RichTextManager {
    return this.richTextManager;
  }

  public getRawText(): string {
    return this.richTextManager.getText();
  }

  public cutText(start: number, end?: number): RichTextManager {
    return this.richTextManager.cutText(start, end);
  }

  public removeText(start: number, end?: number): void {
    this.richTextManager.removeText(start, end);
  }

  public getTextLength(): number {
    return this.richTextManager.getTextLength();
  }

  public addInlineNode(
    arena: ArenaInline,
    start: number,
    end: number,
  ): ArenaNodeInline | undefined {
    return this.richTextManager.addInlineNode(arena, start, end);
  }

  public getInlineNode(
    arena: ArenaInline,
    start: number,
    end: number,
  ): ArenaNodeInline | undefined {
    return this.richTextManager.getInlineNode(arena, start, end);
  }

  public removeInlineNode(node: ArenaNodeInline): void {
    this.richTextManager.removeInlineNode(node);
  }

  updateInlineNode(node: ArenaNodeInline, start: number, end: number): void {
    this.richTextManager.updateInlineNode(node, start, end);
  }
}
