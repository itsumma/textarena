import ArenaCore from './ArenaCore';

interface ArenaSingle extends ArenaCore {
  readonly hasParent: true;
  readonly hasChildren: false;
  readonly hasText: false;
  readonly inline: false;
  readonly single: true;
}

export default ArenaSingle;
