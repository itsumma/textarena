import Textarena from '../Textarena';
import ArenaPlugin, { DefaulPluginOptions } from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaMediatorInterface, ArenaTextInterface } from '../interfaces/Arena';
import { AnyArenaNode } from '../interfaces/ArenaNode';
import utils from '../utils';

const defaultOptions: DefaulPluginOptions = {
  name: 'code',
  tag: 'PRE',
  attributes: {},
  title: 'Моноширный',
  icon: 'pre',
  shortcut: 'Alt + KeyP',
  hint: 'p',
  command: 'convert-to-code',
  marks: [
    {
      tag: 'PRE',
      attributes: [],
    },
  ],
};

const codePlugin = (opts?: Partial<DefaulPluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, tag, attributes, title, icon, shortcut, hint, command, marks,
    } = { ...defaultOptions, ...(opts || {}) };
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const allowedArenas = textarena.getSimpleArenas();
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        allowedArenas,
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
      if (icon) {
        textarena.registerTool({
          name,
          title,
          icon,
          shortcut,
          hint,
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
        hint,
        command,
        canShow: (node: AnyArenaNode) =>
          textarena.isAllowedNode(node, arena),
      });
    }
  },
});

export default codePlugin;
