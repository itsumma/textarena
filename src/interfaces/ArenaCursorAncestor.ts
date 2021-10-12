import { ParentArenaNode } from './ArenaNode';
import ArenaCursor from './ArenaCursor';

export type ArenaCursorAncestor = ArenaCursor & {
  node: ParentArenaNode;
  offset: number;
};

export default ArenaCursorAncestor;
