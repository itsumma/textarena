import AnyArena from './arena/AnyArena';
import ArenaWithText from './arena/ArenaWithText';
import ArenaAncestor from './arena/ArenaAncestor';

export type ArenaOptionsCore = {
  name: string,
  tag: string,
  attributes: string[],
  allowedAttributes?: string[],
  hasParent?: boolean,
  hasChildren?: boolean,
  hasText?: boolean,
  inline?: boolean,
  single?: boolean,
};

export type ArenaOptionsAncestor = ArenaOptionsCore & {
  hasParent?: boolean,
  hasChildren: true,
  hasText?: false,
  inline?: false,
  single?: false,

  automerge?: boolean,
  group?: boolean,
  protected?: boolean,
  protectedChildren?: AnyArena[],
  arenaForText: ArenaAncestor | ArenaWithText | undefined,
  allowedArenas: AnyArena[],
};

export type ArenaOptionsInline = ArenaOptionsCore & {
  hasParent?: false,
  hasChildren?: false,
  hasText?: false,
  inline: true,
  single?: false,
};

export type ArenaOptionsSingle = ArenaOptionsCore & {
  hasParent?: true,
  hasChildren?: false,
  hasText?: false,
  inline?: false,
  single: true,
};

export type ArenaOptionsWithText = ArenaOptionsCore & {
  hasParent?: true;
  hasChildren?: false;
  hasText: true;
  inline?: false;
  single?: false;
  nextArena?: ArenaWithText | ArenaAncestor,
};

export type ArenaOptionsRoot = ArenaOptionsAncestor & {
  hasParent: false;
};

export type ArenaOptionsChild = ArenaOptionsInline |
                    ArenaOptionsSingle |
                    ArenaOptionsWithText |
                    ArenaOptionsAncestor;

type ArenaOptions = ArenaOptionsRoot | ArenaOptionsChild;

export default ArenaOptions;
