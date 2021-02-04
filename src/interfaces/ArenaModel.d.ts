type AbstractArena = {
  name: string,
  tag: string,
  attributes: string[],
  allowFormating?: true,
};

export type ArenaWithText = AbstractArena & {
  allowText: true,
};

export type ArenaWithChildText = AbstractArena & {
  arenaForText: ArenaWithText,
};

export type Arena = ArenaWithText | ArenaWithChildText;

export type ArenaFormating = {
  name: string,
  tag: string,
  attributes: string[],
};

export type ArenaMarker = {
  attributes: string[],
};

export type ArenaMarkers = {
  [tag: string]: Array<ArenaMarker & (
    { arena: Arena } | { formating: ArenaFormating }
  )>,
};

export type ArenaMarketWithTag = ArenaMarker & {
  tag: string,
};

export default interface ArenaModel {
}
