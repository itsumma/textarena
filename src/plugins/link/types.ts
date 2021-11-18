import ElementHelper from '../../helpers/ElementHelper';
import { ArenaInlineInterface } from '../../interfaces/Arena';
import { DefaultPluginOptions } from '../../interfaces/ArenaPlugin';
import CommandAction from '../../interfaces/CommandAction';
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
