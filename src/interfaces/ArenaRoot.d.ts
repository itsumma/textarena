import ArenaAncestor from './ArenaAncestor';

interface ArenaRoot extends ArenaAncestor {
  readonly root: true;
}

export default ArenaRoot;
