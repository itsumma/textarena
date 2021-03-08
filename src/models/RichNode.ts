import { TemplateResult, html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import Arena, { ArenaWithText } from 'interfaces/Arena';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import ArenaModel from 'ArenaModel';
import RichTextManager from 'RichTextManager';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';

export default class RichNode implements ArenaNodeText {
  readonly hasParent: true = true;

  readonly hasText: true = true;

  richTextManager = new RichTextManager();

  constructor(
    public arena: ArenaWithText,
    public parent: ArenaNodeAncestor,
  ) {
  }

  getIndex(): number {
    return this.parent.children.indexOf(this);
  }

  getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  remove(): void {
    this.parent.removeChild(this.getIndex());
  }

  createAndInsertNode(arena: Arena): [
    ArenaNode, ArenaNode, number,
  ] | undefined {
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  }

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
    const content = this.richTextManager.getHtml(model);
    return html`
      ${unsafeHTML(content)}
    `;
  }

  getHtml(model: ArenaModel): TemplateResult | string {
    return this.arena.getTemplate(this.getTemplate(model), this.getGlobalIndex());
  }

  getText(): string | RichTextManager {
    return this.richTextManager;
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
