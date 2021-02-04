type ArenaLevel = string[];

export interface ArenaNode {
  arena: string,
  children: ArenaNode[],
  parent: ArenaNode,
}

export type Arena = {
  name: string,
  tag: string,
  attributes: string[],
  allowFormating?: true,
};

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

type ArenaModel<T> = {
  level: 0,
  allowedLevels: [],
  canRaise: false,
  children: []
};

export default ArenaModel;

