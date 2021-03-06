import { ArenaFormating } from 'ArenaModel';

export default interface ToolOptions {
  name: string;
  icon: string;
  title: string;
  command: string;
  hint: string;
  shortcut: string;
  formating?: ArenaFormating;
}
