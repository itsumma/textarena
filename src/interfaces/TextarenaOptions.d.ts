import ChangeDataListener from './ChangeHandler';
import ReadyDataListener from './ReadyHandler';
import CreatorBarOptions from './CreatorBarOptions';
import TextarenaData from './TextarenaData';
import ToolbarOptions from './ToolbarOptions';

export default interface TextarenaOptions {
  editable?: boolean;
  debug?: boolean;
  onChange?: ChangeDataListener;
  onReady?: ReadyDataListener;
  initData?: TextarenaData;
  toolbar?: ToolbarOptions;
  creatorBar?: CreatorBarOptions;
}
