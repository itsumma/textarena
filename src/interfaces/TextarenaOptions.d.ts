import ChangeDataListener from './ChangeHandler';
import ReadyDataListener from './ReadyHandler';
import CreatorBarOptions from './CreatorBarOptions';
import TextarenaData from './TextarenaData';
import ToolbarOptions from './ToolbarOptions';
import ArenaPlugin from './ArenaPlugin';

type TextarenaOptions = {
  editable?: boolean,
  debug?: boolean,
  onChange?: ChangeDataListener,
  onReady?: ReadyDataListener,
  initData?: TextarenaData,
  plugins?: ArenaPlugin[],
  toolbar?: ToolbarOptions,
  creatorBar?: CreatorBarOptions,
};

export default TextarenaOptions;
