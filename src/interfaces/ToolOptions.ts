import { AnyArenaNode } from './ArenaNode';

export default interface ToolOptions {
  name: string;
  icon: string;
  title: string;
  command: string;
  hint?: string;
  shortcut?: string;
  checkStatus?: (node: AnyArenaNode, start?: number, end?: number) => boolean;
}
