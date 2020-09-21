import ChangeDataListener from "./ChangeHandler";
import MediaTextData from "./MediaTextData";
import ToolbarOptions from "./ToolbarOptions";

export default interface MediaTextOptions {
  editable?: boolean;
  onChange?: ChangeDataListener;
  initData?: MediaTextData;
  toolbar?: ToolbarOptions;
}
