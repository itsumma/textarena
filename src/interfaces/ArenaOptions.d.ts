import Arena, { ArenaWithText } from './Arena';
import ArenaNode from './ArenaNode';

export type AbstractArena = {
  name: string,
  tag: string,
  // template: (child: TemplateResult | string, id: string) => TemplateResult | string,
  attributes: string[],
  init?: (node: ArenaNode) => ArenaNode;
};

export type ArenaOptionsSingle = AbstractArena & {
  single: true,
};

export type ArenaOptionsWithText = AbstractArena & {
  allowText: true,
  allowFormating: boolean,
  nextArena?: ArenaWithText,
};

export type ArenaOptionsAncestor = AbstractArena & {
  hasChildren: true,
  allowedArenas?: Arena[],
  arenaForText?: ArenaWithText,
  protectedChildren?: Arena[]
};

export type ArenaOptionsRoot = ArenaOptionsAncestor & {
  root: true,
};

type ArenaOptions = ArenaOptionsSingle |
                    ArenaOptionsWithText |
                    ArenaOptionsAncestor;

export default ArenaOptions;
