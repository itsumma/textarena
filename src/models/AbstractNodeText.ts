import { TemplateResult } from 'lit-html';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import Arena, { ArenaWithText } from 'interfaces/Arena';
import ArenaNode from 'interfaces/ArenaNode';
import RichTextManager from 'RichTextManager';
import ArenaModel from 'ArenaModel';

export default abstract class AbstractNodeText {
  readonly hasParent: true = true;

  readonly hasText: true = true;

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

  createAndInsertNode(arena: Arena): [
    ArenaNode, ArenaNode, number,
  ] | undefined {
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  }

  insertText(
    text: string | RichTextManager,
    offset: number,
  ): [ArenaNode, number] | undefined {
    return [this, offset];
  }

  getTemplate(model: ArenaModel): TemplateResult | string {
    return '';
  }

  getHtml(model: ArenaModel): TemplateResult | string {
    return this.arena.template(this.getTemplate(model), this.getGlobalIndex());
  }

  remove(): void {
    this.parent.removeChild(this.getIndex());
  }
}
