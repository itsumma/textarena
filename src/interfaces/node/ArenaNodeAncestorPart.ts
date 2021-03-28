import { ChildArena } from '../Arena';
import ArenaCursorAncestor from '../ArenaCursorAncestor';
import { ChildArenaNode } from '../ArenaNode';

export default interface ArenaNodeAncestorPart {
  readonly hasParent: boolean;
  readonly hasChildren: true;
  readonly hasText: false;
  readonly inline: false;
  readonly single: false;

  readonly automerge: boolean;
  readonly group: boolean;
  readonly protected: boolean;

  readonly children: ChildArenaNode[];

  insertNode(node: ChildArenaNode, offset?: number):
    ChildArenaNode | undefined;

  getChild(index: number): ChildArenaNode | undefined;

  removeChild(index: number): ArenaCursorAncestor;

  isAllowedNode(arena: ChildArena): boolean;

  insertChildren(nodes: ChildArenaNode[], offset?: number):
  ChildArenaNode[];

  cutChildren(start: number, length?: number): ChildArenaNode[];

  removeChildren(start: number, length?: number): void;

  mergeChildren(index: number): ArenaCursorAncestor;
}
