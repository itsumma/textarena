import { AnyArenaNode } from './ArenaNode';

export type ToolCheckStatus = (
  node: AnyArenaNode,
  start?: number,
  end?: number
) => boolean | undefined;

export default interface ToolOptions {
  name: string;
  icon: string;
  title: string;
  command: string;
  hint?: string; // Deprecated
  shortcut?: string;
  checkStatus?: ToolCheckStatus;
}
