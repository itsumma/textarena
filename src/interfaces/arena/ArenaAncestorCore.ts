import ArenaCore from './ArenaCore';
import { ArenaMediatorInterface, ArenaTextInterface, ChildArena } from '../Arena';

interface ArenaAncestorCore extends ArenaCore {
  readonly root: boolean;
  readonly hasParent: boolean;
  readonly hasChildren: true;
  readonly hasText: false;
  readonly inline: false;
  readonly single: false;

  readonly automerge: boolean;
  readonly group: boolean;
  readonly protected: boolean;
  readonly protectedChildren: ChildArena[];
  readonly arenaForText: ArenaMediatorInterface | ArenaTextInterface;
  readonly allowedArenas: ChildArena[];
  addAllowedChild(arena: ChildArena): void;
  setArenaForText(arena: ArenaMediatorInterface | ArenaTextInterface): void;
  getArenaForText(): ArenaMediatorInterface | ArenaTextInterface | undefined;
}

export default ArenaAncestorCore;
