import { AnyArenaNode } from './ArenaNode';

export type ToolCheckStatus = (node: AnyArenaNode, start?: number, end?: number) => boolean;

export default interface ToolOptions {
  name: string;
  icon: string;
  title: string;
  command: string;
  hint?: string;
  shortcut?: string;
  checkStatus?: ToolCheckStatus;
}
