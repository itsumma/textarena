import {
  ArenaMediatorInterface, ArenaTextInterface, ChildArena, CommandAction, CreatorCanShow,
  DefaultPluginOptions, TagAndAttributes, ToolCheckStatus,
} from '../../interfaces';

export type ArenaPluginOptions = DefaultPluginOptions & {
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
  tableOptions: DefaultPluginOptions,
  rowOptions: DefaultPluginOptions,
  cellOptions: DefaultPluginOptions,
  commands: CommandPluginOptions[],
};
