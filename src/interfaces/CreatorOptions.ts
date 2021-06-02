import { AnyArenaNode } from './ArenaNode';

export default interface CreatorOptions {
  name: string;
  icon?: string;
  title: string;
  command: string;
  hint?: string;
  shortcut?: string;
  canShow: (node: AnyArenaNode) => boolean;
}
