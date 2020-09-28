import Toolbar from "~/Toolbar";

export default function header(toolbar: Toolbar, config: any) {
  let value = config.header;
  const focusElement = toolbar.getFocusElement();
  if (focusElement && focusElement.closest(value)) {
    document.execCommand('formatblock', false, 'P');
  } else {
    document.execCommand('formatblock', false, value);
  }
}