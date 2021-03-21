import ChildArena from './arena/ChildArena';
import ArenaCursorAncestor from './ArenaCursorAncestor';
import { ArenaNodeParent } from './ArenaNode';

export default interface ArenaNodeScionPart {
  readonly arena: ChildArena;

  readonly hasParent: true;

  readonly parent: ArenaNodeParent;

  remove(): ArenaCursorAncestor

  getIndex(): number;

  isLastChild(): boolean;

  setParent(parent: ArenaNodeParent): void;

  getParent(): ArenaCursorAncestor;
}
