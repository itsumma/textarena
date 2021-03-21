import ArenaRoot from './arena/ArenaRoot';

export default interface ArenaNodeRootPart {
  readonly arena: ArenaRoot;

  readonly root: true;
  readonly hasParent: false;
}
