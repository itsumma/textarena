import { ArenaCursor } from './ArenaCursor';
import { ParentArenaNode } from './ArenaNode';

export type ArenaCursorAncestor = ArenaCursor & {
  node: ParentArenaNode;
  offset: number;
};
