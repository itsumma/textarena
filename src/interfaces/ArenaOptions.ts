import {
  ArenaMediatorInterface, ArenaTextInterface, ChildArena, ProtectedArenas,
} from './Arena';
import ArenaAttributes from './ArenaAttributes';
import { ArenaFormatings } from './ArenaFormating';
import { AnyArenaNode, ArenaNodeText } from './ArenaNode';

export type TextProcessor = (text: string, node: ArenaNodeText) => string;

export type OutputProcessor = (
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
  arenaAttrs: ArenaAttributes,
) => string;

export type ArenaOptionsCore = {
  name: string,
  tag: string,
  attributes: ArenaAttributes,
  allowedAttributes?: string[],
  hasParent?: boolean,
  hasChildren?: boolean,
  hasText?: boolean,
  inline?: boolean,
  single?: boolean,
  root?: boolean;
  output?: OutputProcessor;
  defaultParentArena?: ArenaMediatorInterface;
};

export type ArenaOptionsAncestor = ArenaOptionsCore & {
  // hasChildren?: true,
  // hasParent?: boolean,
  hasText?: false,
  inline?: false,
  single?: false,
  // root?: boolean;

  automerge?: boolean,
  group?: boolean,
  // protected?: boolean,
  arenaForText: ArenaMediatorInterface | ArenaTextInterface
  noPseudoCursor?: boolean;
} & ({
  allowedArenas: ChildArena[],
} | {
  protectedChildren: ProtectedArenas,
});

export type ArenaOptionsInline = ArenaOptionsCore & {
  hasParent?: false,
  // hasChildren?: false,
  hasText?: false,
  inline: true,
  single?: false,
};

export type ArenaOptionsSingle = ArenaOptionsCore & {
  hasParent?: true,
  // hasChildren?: false,
  hasText?: false,
  inline?: false,
  single: true,
};

export type ArenaOptionsWithText = ArenaOptionsCore & {
  hasParent?: true;
  // hasChildren?: false;
  hasText: true;
  inline?: false;
  single?: false;
  nextArena?: ArenaTextInterface | ArenaMediatorInterface,
  getPlain?: TextProcessor;
};

export type ArenaOptionsMediator = ArenaOptionsAncestor & {
  // hasChildren: true,
  // hasParent?: true,
};

export type ArenaOptionsRoot = ArenaOptionsAncestor & {
  // hasChildren: true,
  // hasParent?: false,
};

export type ArenaOptionsChild = ArenaOptionsInline |
                    ArenaOptionsSingle |
                    ArenaOptionsWithText |
                    ArenaOptionsMediator;

type ArenaOptions = ArenaOptionsRoot | ArenaOptionsChild;

export default ArenaOptions;
