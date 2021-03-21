import AnyArena from '../interfaces/arena/AnyArena';

export default abstract class AbstractNode<TArena extends AnyArena> {
  readonly hasParent: boolean = false;

  readonly hasChildren: boolean = false;

  readonly hasText: boolean = false;

  readonly inline: boolean = false;

  readonly single: boolean = false;

  constructor(readonly arena: TArena) {
  }

  // public getIndex(): number {
  //   return this.parent.children.indexOf(this);
  // }

  // public isLastChild(): boolean {
  //   return this.parent.children.indexOf(this) === this.parent.children.length - 1;
  // }

  public getGlobalIndex(): string {
    return '0';
  }

  // public getGlobalIndex(): string {
  //   return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  // }

  // public getParent(): ArenaCursorAncestor {
  //   return { node: this.parent, offset: this.getIndex() };
  // }

  // public setParent(parent: ArenaNodeAncestor | (ArenaNodeAncestor & ArenaNodeScion)): void {
  //   this.parent = parent;
  // }

  public setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  public getAttribute(name: string): string {
    return this.attributes[name] || '';
  }

  protected attributes: { [key: string] :string } = {};
}
