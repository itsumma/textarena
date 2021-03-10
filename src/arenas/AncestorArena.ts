import Arena, { ArenaAncestor, ArenaWithText } from 'interfaces/Arena';
import { ArenaOptionsAncestor } from 'interfaces/ArenaOptions';
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
}
