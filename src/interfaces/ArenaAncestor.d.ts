import ArenaCore from './ArenaCore';
import Arena from './Arena';
import ArenaWithText from './ArenaWithText';

interface ArenaAncestor extends ArenaCore {
  readonly hasChildren: true;
  readonly protected: boolean;
  readonly protectedChildren: Arena[];
  readonly arenaForText: ArenaAncestor | ArenaWithText | undefined
  readonly allowedArenas: Arena[];
  addAllowedChild(arena: Arena): void;
  setArenaForText(arena: ArenaAncestor | ArenaWithText): void;
}

export default ArenaAncestor;
