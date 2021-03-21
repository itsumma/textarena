/* eslint-disable max-classes-per-file */
import AnyArena from '../interfaces/arena/AnyArena';
import ArenaOptions from '../interfaces/ArenaOptions';

import AncestorArena from './AncestorArena';
import RootArena from './RootArena';
import SingleArena from './SingleArena';
import TextArena from './TextArena';
import InlineArena from './InlineArena';

export default class ArenaFactory {
  static create(arenaOptions: ArenaOptions): AnyArena<ArenaOptions> {
    if (arenaOptions.hasChildren) {
      if (arenaOptions.hasParent === false) {
        return new RootArena(arenaOptions);
      }
      return new AncestorArena(arenaOptions);
    }
    if (arenaOptions.single) {
      return new SingleArena(arenaOptions);
    }
    if (arenaOptions.inline) {
      return new InlineArena(arenaOptions);
    }
    return new TextArena(arenaOptions);
  }
}