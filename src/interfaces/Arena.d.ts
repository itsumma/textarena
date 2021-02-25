import { TemplateResult } from 'lit-html';

export type AbstractArena = {
  name: string,
  tag: string,
  template: (child: TemplateResult | string, id: string) => TemplateResult | string,
  attributes: string[],
};

export type ArenaWithNodes = AbstractArena & {
  allowedArenas: AbstractArena[]
};

export type ArenaWithText = AbstractArena & {
  allowText: true,
};

export type ArenaWithChildText = ArenaWithNodes & {
  arenaForText: ArenaWithText,
};

export type ArenaWithRichText = ArenaWithText & {
  allowFormating: true,
};

type Arena = ArenaWithNodes | ArenaWithChildText | ArenaWithText | ArenaWithRichText;

export default Arena;
