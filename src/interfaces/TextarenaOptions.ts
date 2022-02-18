import { ArenaHandler } from '../services';
import { ArenaPlugin } from './ArenaPlugin';
import { ChangeDataListener } from './ChangeHandler';
import { CreatorBarOptions } from './CreatorBarOptions';
import { ReadyDataListener } from './ReadyHandler';
import { TextarenaData } from './TextarenaData';
import { ToolbarOptions } from './ToolbarOptions';

export type TextarenaOptions = {
  editable?: boolean,
  debug?: boolean,
  onChange?: ChangeDataListener,
  onReady?: ReadyDataListener,
  onEvent?: ArenaHandler,
  initData?: Partial<TextarenaData>,
  placeholder?: string,
  plugins?: ArenaPlugin[],
  toolbar?: ToolbarOptions,
  creatorBar?: CreatorBarOptions,
  outputTypes?: string[],
};
