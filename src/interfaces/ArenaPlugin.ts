import Textarena from '../Textarena';
import ArenaAttributes from './ArenaAttributes';
import { OutputProcessor } from './ArenaOptions';

export default interface ArenaPlugin {
  register: (textarena: Textarena) => void;
}

export type ArenaMarkOptions = {
  tag: string,
  attributes: string[];
};

export type DefaulPluginOptions = {
  name: string,
  tag: string,
  attributes: ArenaAttributes,
  allowedAttributes?: string[],
  title: string,
  icon?: string,
  shortcut?: string,
  hint?: string,
  command?: string,
  component?: string,
  marks: ArenaMarkOptions[],
  output?: OutputProcessor
};
