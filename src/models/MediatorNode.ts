import AbstractParentNode from './AbstractParentNode';
// import NodeFactory from './NodeFactory';
import { ArenaMediatorInterface } from '../interfaces/Arena';
import { ArenaNodeMediator } from '../interfaces/ArenaNode';

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

  public clone(): ArenaNodeMediator {
    return new MediatorNode(
      this.arena,
      // this.parent,
      this.children.map((child) => child.clone()),
    );
  }
}
