import { ArenaRootInterface } from '../interfaces/Arena';
import { ArenaNodeRoot, ChildArenaNode } from '../interfaces/ArenaNode';
import AbstractParentNode from './AbstractParentNode';

// У корневого может быть разрешены либо параграфы (заголовки), либо секции (и большие картинки)

export default class RootNode
  extends AbstractParentNode<ArenaRootInterface>
  implements ArenaNodeRoot {
  readonly root: true = true;

  readonly hasParent: false = false;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    public arena: ArenaRootInterface,
    children?: ChildArenaNode[],
  ) {
    super(arena, '', children);
  }

  public clone(): RootNode {
    return new RootNode(
      this.arena,
      this.children.map((child) => child.clone()),
    );
  }
}
