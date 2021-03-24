import AbstractParentNode from './AbstractParentNode';
import { ArenaMediatorInterface } from '../interfaces/Arena';
import { ArenaNodeMediator } from '../interfaces/ArenaNode';

export default class MediatorNode
  extends AbstractParentNode<ArenaMediatorInterface>
  implements ArenaNodeMediator {
  readonly root: false = false;

  readonly hasParent: true = true;

  readonly hasText: false = false;

  readonly inline: false = false;

  readonly single: false = false;

  public clone(): ArenaNodeMediator {
    return new MediatorNode(
      this.arena,
      this.id,
      this.children.map((child) => child.clone()),
      this.attributes,
    );
  }
}
