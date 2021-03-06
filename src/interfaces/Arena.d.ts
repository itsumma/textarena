import { TemplateResult } from 'lit-html';

export type AbstractArena = {
  name: string,
  tag: string,
  template: (child: TemplateResult | string, id: string) => TemplateResult | string,
  attributes: string[],
};

export type ArenaSingle = AbstractArena & {
  single: true,
};

export type ArenaWithNodes = AbstractArena & {
  allowedArenas: AbstractArena[]
};

export type ArenaWithText = AbstractArena & {
  allowText: true,
};

export type ArenaWithChildText = ArenaWithNodes & {
  arenaForText: ArenaWithText | undefined,
};

export type ArenaWithRichText = ArenaWithText & {
  allowFormating: true,
};

type Arena = ArenaSingle | ArenaWithNodes | ArenaWithChildText | ArenaWithText | ArenaWithRichText;

export default Arena;
