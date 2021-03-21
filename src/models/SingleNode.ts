import { TemplateResult } from 'lit-html';
import ArenaNodeAncestor from '../interfaces/ArenaNodeAncestor';
import ArenaNodeScion from '../interfaces/ArenaNodeScion';
import AnyArena from '../interfaces/arena/AnyArena';
import ArenaNodeText from '../interfaces/ArenaNodeText';
import ArenaCursor from '../interfaces/ArenaCursor';
import RichTextManager from '../helpers/RichTextManager';
import ArenaCursorAncestor from '../interfaces/ArenaCursorAncestor';
import ArenaSingle from '../interfaces/arena/ArenaSingle';
import { ArenaFormatings } from '../interfaces/ArenaFormating';

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

  public isLastChild(): boolean {
    return this.parent.children.indexOf(this) === this.parent.children.length - 1;
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

  public getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  public insertText(
    text: string | RichTextManager,
  ): ArenaCursor {
    return this.parent.insertText(text, this.getIndex() + 1);
  }

  public getTextCursor(): ArenaCursor {
    return this.parent.getTextCursor(this.getIndex());
  }

  public createAndInsertNode(
    arena: AnyArena,
  ): ArenaNodeScion | ArenaNodeText | undefined {
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  }

  public remove(): ArenaCursorAncestor {
    return this.parent.removeChild(this.getIndex());
  }

  public getHtml(): TemplateResult | string {
    return this.arena.getTemplate(undefined, this.getGlobalIndex(), this.attributes);
  }

  public getOutputHtml(_frms: ArenaFormatings, deep = 0): string {
    return this.arena.getOutputTemplate('', deep, this.attributes);
  }

  public setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  public getAttribute(name: string): string {
    return this.attributes[name] || '';
  }

  protected attributes: { [key: string] :string } = {};
}
