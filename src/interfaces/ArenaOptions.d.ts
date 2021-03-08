import Arena, { ArenaWithText } from './Arena';

export type AbstractArena = {
  readonly name: string,
  readonly tag: string,
  // template: (child: TemplateResult | string, id: string) => TemplateResult | string,
  readonly attributes: string[],
};

export type ArenaOptionsSingle = AbstractArena & {
  readonly single: true,
};

export type ArenaOptionsWithText = AbstractArena & {
  readonly allowText: true,
  readonly allowFormating: boolean,
};

export type ArenaOptionsAncestor = AbstractArena & {
  readonly hasChildren: true,
  readonly allowedArenas?: Arena[],
  readonly arenaForText?: ArenaWithText,
};

export type ArenaOptionsRoot = ArenaOptionsAncestor & {
  readonly root: true,
};

type ArenaOptions = ArenaOptionsSingle |
                    ArenaOptionsWithText |
                    ArenaOptionsAncestor;

export default ArenaOptions;
