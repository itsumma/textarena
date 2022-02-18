import {
  ArenaMediatorInterface, ArenaTextInterface, ChildArena, ProtectedArenas,
} from '../Arena';
import { ArenaCore } from './ArenaCore';

export interface ArenaAncestorCore extends ArenaCore {
  readonly root: boolean;
  readonly hasParent: boolean;
  readonly hasChildren: true;
  readonly hasText: false;
  readonly inline: false;
  readonly single: false;

  readonly automerge: boolean;
  readonly group: boolean;
  readonly protected: boolean;
  readonly protectedChildren: ProtectedArenas;
  readonly arenaForText: ArenaMediatorInterface | ArenaTextInterface;
  readonly allowedArenas: ChildArena[];
  addAllowedChild(arena: ChildArena): void;
  setArenaForText(arena: ArenaMediatorInterface | ArenaTextInterface): void;
  getArenaForText(): ArenaMediatorInterface | ArenaTextInterface | undefined;
}
