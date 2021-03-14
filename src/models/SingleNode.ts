import { TemplateResult } from 'lit-html';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import Arena from 'interfaces/Arena';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import ArenaCursor from 'interfaces/ArenaCursor';
import RichTextManager from 'RichTextManager';
import ArenaCursorAncestor from 'interfaces/ArenaCursorAncestor';
import ArenaSingle from 'interfaces/ArenaSingle';

export default class SingleNode implements ArenaNodeScion {
  readonly hasParent: true = true;

  constructor(
    public arena: ArenaSingle,
    public parent: ArenaNodeAncestor,
  ) {
  }

  public getIndex(): number {
    return this.parent.children.indexOf(this);
  }

  public getParent(): ArenaCursorAncestor {
    return { node: this.parent, offset: this.getIndex() };
  }

  public getUnprotectedParent(): ArenaCursorAncestor | undefined {
    if (this.parent.arena.protected) {
      return this.parent.getUnprotectedParent();
    }
    return { node: this.parent, offset: this.getIndex() };
  }

  public getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  public insertText(
    text: string | RichTextManager,
  ): ArenaCursor {
    return this.parent.insertText(text, this.getIndex() + 1);
  }

  public getTextCursor(index: number): ArenaCursor {
    return this.parent.getTextCursor(this.getIndex());
  }

  public createAndInsertNode(
    arena: Arena,
  ): ArenaNodeScion | ArenaNodeText | undefined {
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  }

  public remove(): void {
    this.parent.removeChild(this.getIndex());
  }

  public getHtml(): TemplateResult | string {
    return this.arena.getTemplate(undefined, this.getGlobalIndex());
  }
}
