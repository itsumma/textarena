import ArenaCursorAncestor from '../ArenaCursorAncestor';
import { ParentArenaNode } from '../ArenaNode';

export default interface ArenaNodeScionPart {
  readonly hasParent: true;

  readonly parent: ParentArenaNode;

  remove(): ArenaCursorAncestor | undefined

  getIndex(): number;

  isLastChild(): boolean;

  getParent(): ArenaCursorAncestor | undefined;

  setParent(parent: ParentArenaNode): void;

  getUnprotectedParent(): ArenaCursorAncestor | undefined;
}
