import ArenaNodeCore from './ArenaNodeCore';
import ArenaNodeScion from './ArenaNodeScion';
import ArenaNode from './ArenaNode';
import ArenaNodeText from './ArenaNodeText';
import ArenaAncestor from './ArenaAncestor';

export default interface ArenaNodeAncestor extends ArenaNodeCore {
  readonly arena: ArenaAncestor;

  readonly hasChildren: true;

  readonly children: (ArenaNodeScion | ArenaNodeText)[];

  removeChild(index: number): void;

  insertChildren(nodes: (ArenaNodeScion | ArenaNodeText)[]): void;

  cutChildren(start: number, length?: number): (ArenaNodeScion | ArenaNodeText)[];

  removeChildren(start: number, length?: number): void;

  getChild(index: number): (ArenaNode & ArenaNodeScion) | undefined;
}
