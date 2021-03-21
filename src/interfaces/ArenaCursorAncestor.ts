import { ParentArenaNode } from './ArenaNode';

export type ArenaCursorAncestor = {
  node: ParentArenaNode;
  offset: number;
};

export default ArenaCursorAncestor;
