import { AnyArenaNode } from './ArenaNode';

export type CreatorCanShow = (node: AnyArenaNode) => boolean;

export default interface CreatorOptions {
  name: string;
  icon?: string;
  title: string;
  command: string;
  hint?: string;
  shortcut?: string;
  canShow: CreatorCanShow;
}
