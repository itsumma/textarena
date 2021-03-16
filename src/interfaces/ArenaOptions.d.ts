import Arena from './Arena';
import ArenaNode from './ArenaNode';
import ArenaWithText from './ArenaWithText';
import ArenaAncestor from './ArenaAncestor';

export type AbstractArena = {
  name: string,
  tag: string,
  // template: (child: TemplateResult | string, id: string) => TemplateResult | string,
  attributes: string[],
  automerge?: boolean,
  init?: (node: ArenaNode) => ArenaNode;
};

export type ArenaOptionsInline = AbstractArena & {
  inline: true,
};

export type ArenaOptionsSingle = AbstractArena & {
  single: true,
};

export type ArenaOptionsWithText = AbstractArena & {
  allowText: true,
  allowFormating: boolean,
  nextArena?: ArenaWithText | ArenaAncestor,
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

type ArenaOptions = ArenaOptionsInline |
                    ArenaOptionsSingle |
                    ArenaOptionsWithText |
                    ArenaOptionsAncestor;

export default ArenaOptions;
