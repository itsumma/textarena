import ArenaNodeCore from './ArenaNodeCore';
import ArenaNodeScion from './ArenaNodeScion';
import ArenaNode from './ArenaNode';

export default interface ArenaNodeAncestor extends ArenaNodeCore {
  readonly hasChildren: true;

  readonly children: (ArenaNode & ArenaNodeScion)[];

  removeChild(index: number): void;

  removeChildren(start: number, length?: number): void;

  getChild(index: number): (ArenaNode & ArenaNodeScion) | undefined;
}
