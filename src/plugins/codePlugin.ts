import { ArenaSelection } from '../helpers';
import {
  AnyArenaNode, ArenaMediatorInterface, ArenaPlugin, ArenaTextInterface, DefaultPluginOptions,
} from '../interfaces';
import Textarena from '../Textarena';
import utils from '../utils';

const defaultOptions: DefaultPluginOptions = {
  name: 'code',
  tag: 'PRE',
  attributes: {},
  title: 'Моноширный',
  icon: 'pre',
  shortcut: 'Ctrl + Alt + P',
  command: 'convert-to-code',
  marks: [
    {
      tag: 'PRE',
      attributes: [],
    },
  ],
};

export const codePlugin = (opts?: Partial<DefaultPluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, tag, attributes, title, icon, shortcut, command, marks,
    } = { ...defaultOptions, ...(opts || {}) };
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        allowedArenas: [paragraph],
        arenaForText: paragraph as ArenaTextInterface,
        automerge: true,
        group: true,
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaMediatorInterface;
    textarena.addSimpleArenas(arena);
    if (command) {
      textarena.registerCommand(
        command,
        (ta: Textarena, selection: ArenaSelection) =>
          ta.applyArenaToSelection(selection, arena),
      );
      if (shortcut) {
        textarena.registerShortcut(
          shortcut,
          command,
        );
      }
      if (title) {
        if (icon) {
          textarena.registerTool({
            name,
            title,
            icon,
            shortcut,
            command,
            checkStatus: (node: AnyArenaNode):
              boolean => !!utils.modelTree.findNodeUp(node, (n) => n.arena === arena),
          });
        }
        textarena.registerCreator({
          name,
          title,
          icon,
          shortcut,
          command,
          canShow: (node: AnyArenaNode) =>
            textarena.isAllowedNode(node, arena),
        });
      }
    }
  },
});
