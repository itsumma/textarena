import ArenaAncestor from './ArenaAncestor';

interface ArenaRoot extends ArenaAncestor {
  readonly root: true;
  readonly hasParent: false;
}

export default ArenaRoot;
