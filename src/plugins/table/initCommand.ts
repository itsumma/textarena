import Textarena from '../../Textarena';
import { CommandPluginOptions } from './types';

export function initCommand(
  textarena: Textarena,
  opts: CommandPluginOptions,
): void {
  const {
    command,
    action,
    shortcut,
    icon,
    title,
    checkStatus,
    canShow,
  } = opts;
  textarena.registerCommand(command, action);
  if (shortcut) {
    textarena.registerShortcut(
      shortcut,
      command,
    );
  }
  if (title && canShow) {
    textarena.registerCreator({
      name: command,
      icon,
      title,
      shortcut,
      command,
      canShow,
    });
    if (icon) {
      textarena.registerTool({
        name: command,
        title,
        icon,
        shortcut,
        command,
        checkStatus,
      });
    }
  }
}
