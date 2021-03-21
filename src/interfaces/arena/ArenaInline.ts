import ArenaCore from './ArenaCore';

interface ArenaInline extends ArenaCore {
  readonly hasParent: false;
  readonly hasChildren: false;
  readonly hasText: false;
  readonly inline: true;
  readonly single: false;
}

export default ArenaInline;
