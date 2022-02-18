/* eslint-disable max-classes-per-file */
import { ArenaOptionsChild, ArenaOptionsRoot } from '../interfaces/ArenaOptions';

import { ArenaRoot } from './ArenaRoot';
import { ArenaSingle } from './ArenaSingle';
import { ArenaText } from './ArenaText';
import { ArenaInline } from './ArenaInline';
import { ArenaMediator } from './ArenaMediator';
import { ArenaInlineInterface, ArenaRootInterface, ChildArena } from '../interfaces/Arena';

export class ArenaFactory {
  static createRoot(arenaOptions: ArenaOptionsRoot): ArenaRootInterface {
    return new ArenaRoot(arenaOptions);
  }

  static createChild(arenaOptions: ArenaOptionsChild): ChildArena | ArenaInlineInterface {
    if ('allowedArenas' in arenaOptions
      || 'protectedChildren' in arenaOptions) {
      return new ArenaMediator(arenaOptions);
    }
    if (arenaOptions.single) {
      return new ArenaSingle(arenaOptions);
    }
    if (arenaOptions.inline) {
      return new ArenaInline(arenaOptions);
    }
    if (arenaOptions.hasText) {
      return new ArenaText(arenaOptions);
    }
    throw new Error('Cant create Arena');
  }
}
