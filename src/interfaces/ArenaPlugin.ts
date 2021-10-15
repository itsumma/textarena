import Textarena from '../Textarena';
import ArenaAttributes from './ArenaAttributes';
import { TagAndAttributes } from './ArenaFormating';
import { OutputProcessor } from './ArenaOptions';
import { ArenaMediatorInterface } from './Arena';

export default interface ArenaPlugin {
  register: (textarena: Textarena) => void;
}

export type DefaulPluginOptions = {
  name: string,
  tag: string,
  attributes: ArenaAttributes,
  allowedAttributes?: string[],
  noPseudoCursor?: boolean,
  title?: string,
  icon?: string,
  shortcut?: string,
  description?: string,
  hint?: string,
  command?: string,
  component?: string,
  componentConstructor?: CustomElementConstructor,
  marks: TagAndAttributes[],
  output?: OutputProcessor
  defaultParentArena?: ArenaMediatorInterface;
};
