import ChangeDataListener from "./ChangeHandler";
import CreatorBarOptions from "./CreatorBarOptions";
import TextarenaData from "./TextarenaData";
import ToolbarOptions from "./ToolbarOptions";

export default interface TextarenaOptions {
  editable?: boolean;
  onChange?: ChangeDataListener;
  initData?: TextarenaData;
  toolbar?: ToolbarOptions;
  creatorBar?: CreatorBarOptions;
}
