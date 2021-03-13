import ArenaCore from 'interfaces/Arena';
import ArenaOptions, { ArenaOptionsRoot } from 'interfaces/ArenaOptions';
import AncestorArena from './AncestorArena';
import RootArena from './RootArena';
import SingleArena from './SingleArena';
import TextArena from './TextArena';

export default class ArenaFactory {
  static create(arenaOptions: ArenaOptions | ArenaOptionsRoot): ArenaCore {
    if ('root' in arenaOptions && arenaOptions.root === true) {
      return new RootArena(arenaOptions);
    }
    if ('single' in arenaOptions && arenaOptions.single === true) {
      return new SingleArena(arenaOptions);
    }
    if ('hasChildren' in arenaOptions && arenaOptions.hasChildren === true) {
      return new AncestorArena(arenaOptions);
    }
    if ('allowText' in arenaOptions && arenaOptions.allowText === true) {
      return new TextArena(arenaOptions);
    }
    throw new Error('Cant create Arena');
  }
}
