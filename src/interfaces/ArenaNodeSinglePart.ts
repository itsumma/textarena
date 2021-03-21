import ArenaSingle from './arena/ArenaSingle';

export default interface ArenaNodeSinglePart {
  readonly arena: ArenaSingle;

  readonly hasChildren: false;
  readonly hasText: false;
  readonly inline: false;
  readonly single: true;
}
