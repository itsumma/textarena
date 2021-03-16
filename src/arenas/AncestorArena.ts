import Arena from 'interfaces/Arena';
import ArenaAncestor from 'interfaces/ArenaAncestor';
import { ArenaOptionsAncestor } from 'interfaces/ArenaOptions';
import ArenaWithText from 'interfaces/ArenaWithText';
import AbstractArena from './AbstractArena';

export default class AncestorArena
  extends AbstractArena
  implements ArenaAncestor {
  readonly hasChildren = true;

  public protected = false;

  readonly allowedArenas: Arena[];

  public arenaForText: ArenaAncestor | ArenaWithText | undefined;

  readonly protectedChildren: Arena[] = [];

  constructor(options: ArenaOptionsAncestor) {
    super(options);
    this.arenaForText = options.arenaForText;
    this.allowedArenas = options.allowedArenas || [];
    if (options.protectedChildren !== undefined) {
      this.protected = true;
      this.protectedChildren = options.protectedChildren;
    }
  }

  addAllowedChild(arena: Arena): void {
    this.allowedArenas.push(arena);
  }

  setArenaForText(arena: ArenaAncestor | ArenaWithText): void {
    this.arenaForText = arena;
  }

  getArenaForText(): ArenaAncestor | ArenaWithText | undefined {
    return this.arenaForText;
  }
}
