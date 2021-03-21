import ArenaCore from './ArenaCore';
import ArenaAncestor from './ArenaAncestor';
import ArenaMiddleware from '../ArenaMiddleware';

interface ArenaWithText extends ArenaCore {
  readonly hasParent: true;
  readonly hasChildren: false;
  readonly hasText: true;
  readonly inline: false;
  readonly single: false;

  readonly nextArena: ArenaWithText | ArenaAncestor | undefined;
  middlewares: ArenaMiddleware[];
  registerMiddleware: (middleware: ArenaMiddleware) => void;
}

export default ArenaWithText;
