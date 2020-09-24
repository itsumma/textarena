import ChangeDataListener from "./ChangeHandler";
import CreatorBarOptions from "./CreatorBarOptions";
import MediaTextData from "./MediaTextData";
import ToolbarOptions from "./ToolbarOptions";

export default interface MediaTextOptions {
  editable?: boolean;
  onChange?: ChangeDataListener;
  initData?: MediaTextData;
  toolbar?: ToolbarOptions;
  creatorBar?: CreatorBarOptions;
}
