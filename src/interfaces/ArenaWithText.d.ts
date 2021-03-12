import ArenaCore from './ArenaCore';
import { Middleware } from './Arena';
import ArenaAncestor from './ArenaAncestor';

interface ArenaWithText extends ArenaCore {
  readonly allowText: true;
  readonly nextArena: ArenaWithText | ArenaAncestor | undefined;
  middlewares: Middleware[];
  registerMiddleware: (middleware: Middleware) => void;
}

export default ArenaWithText;
