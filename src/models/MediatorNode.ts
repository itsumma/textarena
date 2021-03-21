import AbstractParentNode from './AbstractParentNode';
// import NodeFactory from './NodeFactory';
import { ArenaMediatorInterface } from '../interfaces/Arena';
import { ArenaNodeMediator, ChildArenaNode } from '../interfaces/ArenaNode';

// TODO сделать вариант когда у нас фиксированное количество дочерних нод,
// например callout (title, paragraph)
// или quote (title, section).

export default class MediatorNode
  extends AbstractParentNode<ArenaMediatorInterface>
  implements ArenaNodeMediator {
  readonly root: false = false;

  readonly hasParent: true = true;

  readonly hasText: false = false;

  readonly inline: false = false;

  readonly single: false = false;

  // constructor(
  //   public arena: ArenaMediatorInterface,
  //   // public parent?: ParentArenaNode,
  //   children?: ChildArenaNode[],
  // ) {
  //   super(arena, children);
  // }

  // Child methods //

  public cutChildren(start: number, length?: number): ChildArenaNode[] {
    let result: ChildArenaNode[] = [];
    if (!this.arena.protected) {
      if (length === undefined) {
        result = this.children.splice(start);
      } else {
        result = this.children.splice(start, length);
      }
      this.mergeChildren(start);
    }
    return result;
  }

  public removeChildren(start: number, length?: number): void {
    this.cutChildren(start, length);
  }
  // End child methods //

  public clone(): ArenaNodeMediator {
    return new MediatorNode(
      this.arena,
      // this.parent,
      this.children.map((child) => child.clone()),
    );
  }
}
