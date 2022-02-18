import Textarena from '../Textarena';
import { ArenaMediatorInterface } from './Arena';
import { ArenaAttributes } from './ArenaAttributes';
import { TagAndAttributes } from './ArenaFormating';
import { OutputProcessor } from './ArenaOptions';

export interface ArenaPlugin {
  register: (textarena: Textarena) => void;
}

export type DefaultPluginOptions = {
  name: string,
  tag: string,
  attributes: ArenaAttributes,
  allowedAttributes?: string[],
  noPseudoCursor?: boolean,
  title?: string,
  icon?: string,
  shortcut?: string,
  description?: string,
  hint?: string, // Deprecated
  command?: string,
  component?: string,
  componentConstructor?: CustomElementConstructor,
  marks: TagAndAttributes[],
  output?: OutputProcessor
  defaultParentArena?: ArenaMediatorInterface;
};
