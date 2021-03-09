import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import Arena, { ArenaSingle } from 'interfaces/Arena';
import RichTextManager from 'RichTextManager';
import { TemplateResult } from 'lit-html';
import ArenaNodeText from 'interfaces/ArenaNodeText';

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

  public getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  public insertText(
    text: string | RichTextManager,
  ): [ArenaNode, number] | undefined {
    return this.parent.insertText(text, this.getIndex() + 1);
  }

  public getTextNode(): ArenaNodeText | undefined {
    return undefined;
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
    return this.arena.getTemplate('', this.getGlobalIndex());
  }
}
