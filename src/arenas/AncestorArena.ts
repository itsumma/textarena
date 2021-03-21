import AnyArena from '../interfaces/arena/AnyArena';
import ArenaAncestor from '../interfaces/arena/ArenaAncestor';
import { ArenaOptionsAncestor } from '../interfaces/ArenaOptions';
import ArenaWithText from '../interfaces/arena/ArenaWithText';
import AbstractArena from './AbstractArena';

export default class AncestorArena
  extends AbstractArena
  implements ArenaAncestor {
  readonly hasParent: false = false;

  readonly hasChildren: true = true;

  readonly hasText: false = false;

  readonly inline: false = false;

  readonly single: false = false;

  readonly automerge: boolean = false;

  readonly group: boolean = false;

  readonly protected: boolean = false;

  readonly protectedChildren: AnyArena[] = [];

  public arenaForText: ArenaAncestor | ArenaWithText | undefined;

  readonly allowedArenas: AnyArena[] = [];

  constructor(options: ArenaOptionsAncestor) {
    super(options);
    if (options.protected && options.protectedChildren !== undefined) {
      this.protected = true;
      this.protectedChildren = options.protectedChildren;
    } else {
      if (options.automerge) {
        this.automerge = options.automerge;
      }
      if (options.group) {
        this.group = options.group;
      }
    }

    this.arenaForText = options.arenaForText;
    this.allowedArenas = options.allowedArenas || [];
  }

  addAllowedChild(arena: AnyArena): void {
    this.allowedArenas.push(arena);
  }

  setArenaForText(arena: ArenaAncestor | ArenaWithText): void {
    this.arenaForText = arena;
  }

  getArenaForText(): ArenaAncestor | ArenaWithText | undefined {
    return this.arenaForText;
  }
}
