import { ArenaNodeChild } from './ArenaNode';
import ArenaAncestor from './arena/ArenaAncestor';
import ArenaCursorAncestor from './ArenaCursorAncestor';
import ChildArena from './arena/ChildArena';

export default interface ArenaNodeAncestorPart {
  readonly arena: ArenaAncestor;

  readonly hasParent: boolean;
  readonly hasChildren: true;
  readonly hasText: false;
  readonly inline: false;
  readonly single: false;

  readonly automerge: boolean;
  readonly group: boolean;
  readonly protected: boolean;

  readonly children: ArenaNodeChild[];

  getChild(index: number): ArenaNodeChild | undefined;

  removeChild(index: number): ArenaCursorAncestor;

  canCreateNode(arena: ChildArena): boolean;

  createAndInsertNode(arena: ChildArena, offset: number):
    ArenaNodeChild | undefined;

  insertChildren(nodes: ArenaNodeChild[], offset?: number):
  ArenaNodeChild[];

  cutChildren(start: number, length?: number): ArenaNodeChild[];

  removeChildren(start: number, length?: number): void;
}
