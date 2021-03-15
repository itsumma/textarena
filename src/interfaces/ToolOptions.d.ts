import ArenaNode from './ArenaNode';

export default interface ToolOptions {
  name: string;
  icon: string;
  title: string;
  command: string;
  hint: string;
  shortcut: string;
  checkStatus: (node: ArenaNode, start?: number, end?: number) => boolean;
}
