import { TreeArena } from '../interfaces/Arena';
import ArenaAttributes from '../interfaces/ArenaAttributes';
import ArenaCursorAncestor from '../interfaces/ArenaCursorAncestor';
import { ChildArenaNode, ParentArenaNode } from '../interfaces/ArenaNode';

export default abstract class AbstractNode<
  TArena extends TreeArena
> {
  readonly hasParent: boolean = false;

  readonly hasChildren: boolean = false;

  readonly hasText: boolean = false;

  readonly inline: boolean = false;

  readonly single: boolean = false;

  protected _parent: ParentArenaNode | undefined;

  get parent(): ParentArenaNode {
    if (!this._parent) {
      throw Error('parrent not set');
    }
    return this._parent;
  }

  constructor(
    readonly arena: TArena,
    readonly id: string,
    attributes?: ArenaAttributes,
  ) {
    this.attributes = attributes || {};
  }

  // Child node methods

  public getId(): string {
    return this.id;
  }

  public getIndex(): number {
    // if (!this.parent) {
    //   return 0;
    // }
    return this.parent.children.indexOf(this as unknown as ChildArenaNode);
  }

  public isLastChild(): boolean {
    // if (!this.parent) {
    //   return false;
    // }
    return this.parent.children.indexOf(this as unknown as ChildArenaNode)
      === this.parent.children.length - 1;
  }

  // public getGlobalIndex(): string {
  //   if (!this._parent) {
  //     return '0';
  //   }
  //   return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  // }

  public getParent(): ArenaCursorAncestor {
    return { node: this.parent, offset: this.getIndex() };
  }

  public setParent(parent: ParentArenaNode): void {
    this._parent = parent;
  }

  // TODO deprecate
  public getUnprotectedParent(): ArenaCursorAncestor | undefined {
    if (this.parent) {
      if (this.parent.arena.protected) {
        if (this.parent.hasParent) {
          return this.parent.getUnprotectedParent();
        }
        return undefined;
      }
      return { node: this.parent, offset: this.getIndex() };
    }
    return undefined;
  }

  public remove(): ArenaCursorAncestor {
    return this.parent.removeChild(this.getIndex());
  }

  // Attributes methods

  public setAttribute(name: string, value: string | boolean): void {
    this.attributes[name] = value;
  }

  public setAttributes(attrs: ArenaAttributes): void {
    console.log('setAttributes', this, attrs);
    Object.entries(attrs).forEach(([name, value]) => this.setAttribute(name, value));
  }

  public getAttribute(name: string): string | boolean {
    return this.attributes[name] || '';
  }

  protected attributes: ArenaAttributes = {};
}
