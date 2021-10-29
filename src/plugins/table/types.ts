import { ArenaMediatorInterface, ArenaTextInterface, ChildArena } from '../../interfaces/Arena';
import { DefaulPluginOptions } from '../../interfaces/ArenaPlugin';
import CommandAction from '../../interfaces/CommandAction';
import { TagAndAttributes } from '../../interfaces/ArenaFormating';
import { ToolCheckStatus } from '../../interfaces/ToolOptions';
import { CreatorCanShow } from '../../interfaces/CreatorOptions';

export type ArenaPluginOptions = DefaulPluginOptions & {
  marks: TagAndAttributes[],
  parentArenas: string[],
  allowedArenas: ChildArena[],
  arenaForText: ArenaMediatorInterface | ArenaTextInterface,

};

export type CommandPluginOptions = {
  command: string,
  action: CommandAction,
  shortcut?: string,
  title?: string,
  icon?: string,
  description?: string,
  checkStatus?: ToolCheckStatus;
  canShow?: CreatorCanShow;
};

export type TablePluginOptions = {
  tableOptions: DefaulPluginOptions,
  rowOptions: DefaulPluginOptions,
  cellOptions: DefaulPluginOptions,
  commands: CommandPluginOptions[],
};
