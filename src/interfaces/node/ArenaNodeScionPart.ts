import ArenaCursorAncestor from '../ArenaCursorAncestor';
import { ParentArenaNode } from '../ArenaNode';

export default interface ArenaNodeScionPart {
  readonly hasParent: true;

  readonly parent: ParentArenaNode;

  remove(): ArenaCursorAncestor

  getIndex(): number;

  isFirstChild(): boolean;

  isLastChild(): boolean;

  getParent(): ArenaCursorAncestor;

  setParent(parent: ParentArenaNode): void;

  getUnprotectedParent(): ArenaCursorAncestor | undefined;
}
