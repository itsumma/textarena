import { TemplateResult, html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import RichTextManager from '../helpers/RichTextManager';
import { ArenaInlineInterface, ArenaTextInterface } from '../interfaces/Arena';
import ArenaAttributes from '../interfaces/ArenaAttributes';
import ArenaCursorText from '../interfaces/ArenaCursorText';
import ArenaFormating, { ArenaFormatings } from '../interfaces/ArenaFormating';
import {
  ArenaNodeInline, ArenaNodeText,
} from '../interfaces/ArenaNode';
import AbstractNode from './AbstractNode';

export default class TextNode
  extends AbstractNode<ArenaTextInterface>
  implements ArenaNodeText {
  readonly hasParent: true = true;

  readonly hasChildren: false = false;

  readonly hasText: true = true;

  readonly inline: false = false;

  readonly single: false = false;

  private richTextManager;

  constructor(
    arena: ArenaTextInterface,
    id: string,
    attributes?: ArenaAttributes,
    text?: string | RichTextManager,
  ) {
    super(arena, id, attributes);
    if (text && text instanceof RichTextManager) {
      this.richTextManager = text.clone();
    } else {
      this.richTextManager = new RichTextManager();
    }
  }

  public getHtml(frms: ArenaFormatings): TemplateResult | string {
    const content = this.richTextManager.getHtml(frms);
    return this.arena.getTemplate(
      html`${unsafeHTML(content)}`,
      this.getGlobalIndex(),
      this.attributes,
    );
  }

  public getOutputHtml(
    frms: ArenaFormatings,
    deep = 0,
    start?: number,
    end?: number,
  ): string {
    const text = this.richTextManager.getHtml(frms, start, end);
    return this.arena.getOutputTemplate(text, deep, this.attributes, true);
  }

  getTextCursor(index: number): ArenaCursorText {
    return {
      node: this,
      offset: index === -1 ? this.getTextLength() : index,
    };
  }

  // public createAndInsertNode(arena: ChildArena): ChildArenaNode | undefined {
  //   return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  // }

  // Text node methods //

  public insertText(
    text: string | RichTextManager,
    offset: number,
    keepFormatings = false,
  ): ArenaCursorText {
    return {
      node: this,
      offset: this.richTextManager.insertText(text, offset, keepFormatings),
    };
  }

  public insertFormating(name: string, start: number, end: number): void {
    this.richTextManager.insertFormating(name, start, end);
  }

  public togglePromiseFormating(formating: ArenaFormating, offset: number): void {
    this.richTextManager.togglePromiseFormating(formating, offset);
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

  public isEmpty(): boolean {
    return /^[\s\n]*$/.test(this.getRawText());
  }

  public addInlineNode(
    arena: ArenaInlineInterface,
    start: number,
    end: number,
  ): ArenaNodeInline | undefined {
    return this.richTextManager.addInlineNode(arena, start, end);
  }

  public getInlineNode(
    arena: ArenaInlineInterface,
    start: number,
    end: number,
  ): ArenaNodeInline | undefined {
    return this.richTextManager.getInlineNode(arena, start, end);
  }

  public removeInlineNode(node: ArenaNodeInline): void {
    this.richTextManager.removeInlineNode(node);
  }

  public updateInlineNode(node: ArenaNodeInline, start: number, end: number): void {
    this.richTextManager.updateInlineNode(node, start, end);
  }

  public clone(): TextNode {
    return new TextNode(
      this.arena,
      this.id,
      this.attributes,
      this.richTextManager.clone(),
    );
  }
}
