import { ArenaMediatorInterface, ArenaTextInterface, ChildArena } from '../interfaces/Arena';
import { ArenaOptionsAncestor } from '../interfaces/ArenaOptions';
import AbstractArena from './AbstractArena';

export default abstract class AbstractAncestorArena
  extends AbstractArena {
  readonly root: boolean = false;

  readonly hasParent: boolean = true;

  readonly hasChildren: true = true;

  readonly hasText: false = false;

  readonly inline: false = false;

  readonly single: false = false;

  readonly automerge: boolean = false;

  readonly group: boolean = false;

  readonly protected: boolean = false;

  readonly protectedChildren: ChildArena[] = [];

  public arenaForText: ArenaMediatorInterface | ArenaTextInterface;

  readonly allowedArenas: ChildArena[] = [];

  constructor(options: ArenaOptionsAncestor) {
    super(options);
    if ('protectedChildren' in options) {
      this.protected = true;
      this.protectedChildren = options.protectedChildren;
      this.allowedArenas = options.protectedChildren;
    } else {
      this.allowedArenas = options.allowedArenas || [];
      if (options.automerge) {
        this.automerge = options.automerge;
      }
      if (options.group) {
        this.group = options.group;
      }
    }

    this.arenaForText = options.arenaForText;
  }

  addAllowedChild(arena: ChildArena): void {
    this.allowedArenas.push(arena);
  }

  setArenaForText(arena: ArenaMediatorInterface | ArenaTextInterface): void {
    this.arenaForText = arena;
  }

  getArenaForText(): ArenaMediatorInterface | ArenaTextInterface | undefined {
    return this.arenaForText;
  }
}
