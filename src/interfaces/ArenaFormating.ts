export type ArenaFormating = {
  name: string,
  tag: string,
  attributes: string[],
};

export type ArenaFormatings = {
  [key: string]: ArenaFormating,
};

export type TagAndAttributes = {
  tag: string,
  attributes: string[],
  excludeAttributes?: string[],
};
