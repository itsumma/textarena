import Textarena from '../Textarena';

export default interface ArenaPlugin {
  register: (textarena: Textarena) => void;
}

export type ArenaMarkOptions = {
  tag: string,
  attributes: string[];
};

export type DefaulPlugintOptions = {
  name: string,
  tag: string,
  attributes: string[],
  allowedAttributes?: string[],
  title: string,
  icon?: string,
  shortcut?: string,
  hint?: string,
  command: string,
  component?: string,
  marks: ArenaMarkOptions[],
};
