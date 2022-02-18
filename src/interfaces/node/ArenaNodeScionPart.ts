import { ArenaCursorAncestor } from '../ArenaCursorAncestor';
import { ParentArenaNode } from '../ArenaNode';

export interface ArenaNodeScionPart {
  readonly hasParent: true;

  readonly parent: ParentArenaNode;

  remove(): ArenaCursorAncestor

  getIndex(): number;

  isFirstChild(): boolean;

  isLastChild(): boolean;

  getParent(): ArenaCursorAncestor;

  containsParent(parent: ParentArenaNode): boolean;

  setParent(parent: ParentArenaNode): void;

  getUnprotectedParent(): ArenaCursorAncestor | undefined;
}
