import ChangeDataListener from './ChangeHandler';
import ReadyDataListener from './ReadyHandler';
import CreatorBarOptions from './CreatorBarOptions';
import TextarenaData from './TextarenaData';
import ToolbarOptions from './ToolbarOptions';
import ArenaPlugin from './ArenaPlugin';
import { ArenaHandler } from '../services/EventManager';

type TextarenaOptions = {
  editable?: boolean,
  debug?: boolean,
  onChange?: ChangeDataListener,
  onReady?: ReadyDataListener,
  onEvent?: ArenaHandler,
  initData?: Partial<TextarenaData>,
  plugins?: ArenaPlugin[],
  toolbar?: ToolbarOptions,
  creatorBar?: CreatorBarOptions,
  outputTypes?: string[],
};

export default TextarenaOptions;
