import { AnyArenaNode } from './ArenaNode';

export type CreatorCanShow = (node: AnyArenaNode) => boolean;

export interface CreatorOptions {
  name: string;
  icon?: string;
  title: string;
  command: string;
  hint?: string; // Deprecated
  shortcut?: string;
  canShow: CreatorCanShow;
}
