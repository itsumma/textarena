import { ElementHelper } from '../../helpers';
import { ArenaInlineInterface, CommandAction, DefaultPluginOptions } from '../../interfaces';
import Textarena from '../../Textarena';

type LinkManage = (
  ta: Textarena,
  arena: ArenaInlineInterface,
  linkbar: ElementHelper,
) => void;

export type LinkPluginOptions = DefaultPluginOptions & {
  moveCursorHandler: LinkManage,
  commandFunction:
    (arena: ArenaInlineInterface, linkModal: ElementHelper | undefined) => CommandAction,
};
