import ArenaCore from './ArenaCore';
import AnyArena from './AnyArena';
import ArenaWithText from './ArenaWithText';

interface ArenaAncestor extends ArenaCore {
  readonly hasParent: boolean;
  readonly hasChildren: true;
  readonly hasText: false;
  readonly inline: false;
  readonly single: false;

  readonly automerge: boolean;
  readonly group: boolean;
  readonly protected: boolean;
  readonly protectedChildren: AnyArena[];
  readonly arenaForText: ArenaAncestor | ArenaWithText;
  readonly allowedArenas: AnyArena[];
  addAllowedChild(arena: AnyArena): void;
  setArenaForText(arena: ArenaAncestor | ArenaWithText): void;
  getArenaForText(): ArenaAncestor | ArenaWithText | undefined;
}

export default ArenaAncestor;
