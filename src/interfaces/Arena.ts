import ArenaMiddleware from './ArenaMiddleware';
import ArenaAncestorCore from './arena/ArenaAncestorCore';
import ArenaCore from './arena/ArenaCore';

export interface ArenaRootInterface extends ArenaAncestorCore {
  readonly root: true;
  readonly hasParent: false;
}

export interface ArenaMediatorInterface extends ArenaAncestorCore {
  readonly root: boolean;
  readonly hasParent: boolean;
}

export interface ArenaTextInterface extends ArenaCore {
  readonly hasParent: true;
  readonly hasChildren: false;
  readonly hasText: true;
  readonly inline: false;
  readonly single: false;

  readonly nextArena: ArenaTextInterface | ArenaMediatorInterface | undefined;
  middlewares: ArenaMiddleware[];
  registerMiddleware: (middleware: ArenaMiddleware) => void;
}

export interface ArenaSingleInterface extends ArenaCore {
  readonly hasParent: true;
  readonly hasChildren: false;
  readonly hasText: false;
  readonly inline: false;
  readonly single: true;
}

export interface ArenaInlineInterface extends ArenaCore {
  readonly hasParent: false;
  readonly hasChildren: false;
  readonly hasText: false;
  readonly inline: true;
  readonly single: false;
}

export type ParentArena = ArenaMediatorInterface | ArenaRootInterface;

export type ChildArena = ArenaMediatorInterface | ArenaSingleInterface | ArenaTextInterface;

export type TreeArena = ArenaRootInterface | ChildArena;

export type AnyArena = ArenaRootInterface | ChildArena | ArenaInlineInterface;
