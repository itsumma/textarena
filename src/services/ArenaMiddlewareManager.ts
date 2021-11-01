import ArenaSelection from '../helpers/ArenaSelection';
import { AnyArena } from '../interfaces/Arena';
import ArenaMiddleware from '../interfaces/ArenaMiddleware';
import ArenaServiceManager from './ArenaServiceManager';

export type MiddlewareWhenCondition = 'before' | 'after';

export default class ArenaMiddlewareManager {
  constructor(protected asm: ArenaServiceManager) {
  }

  private middlewares: {
    middleware: ArenaMiddleware,
    when: MiddlewareWhenCondition,
    scope?: AnyArena,
    priority: number,
  }[] = [];

  public registerMiddleware(
    middleware: ArenaMiddleware,
    when: MiddlewareWhenCondition,
    scope?: AnyArena,
    priority?: number,
  ): void {
    this.middlewares.push({
      middleware, when, scope, priority: priority ?? 1,
    });
  }

  public applyMiddlewares(
    sel: ArenaSelection,
    data: string | DataTransfer,
    when: MiddlewareWhenCondition,
  ): [boolean, ArenaSelection] {
    let success = false;
    let result = false;
    let newSel = sel;
    const node = sel.startNode;
    const sorted = this.middlewares.sort((a, b) => a.priority - b.priority);

    for (let i = 0; i < sorted.length; i += 1) {
      const { middleware, scope, when: whenCondition } = this.middlewares[i];
      let allowExec = when === whenCondition;
      if (scope && (!sel.isSameNode() || scope !== node.arena)) {
        allowExec = false;
      }
      if (allowExec) {
        [success, newSel] = middleware(this.asm.textarena, newSel, data);
        result = success || result;
        if (success) {
          break;
        }
      }
    }
    return [result, newSel];
  }
}
