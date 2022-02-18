import { ArenaSelection } from '../helpers';
import {
  AnyArenaNode, ArenaMediatorInterface, ArenaPlugin, ArenaTextInterface, DefaultPluginOptions,
} from '../interfaces';
import Textarena from '../Textarena';
import utils from '../utils';

const defaultOptions: DefaultPluginOptions = {
  name: 'aside',
  tag: 'ASIDE',
  attributes: { class: 'aside aside-gray' },
  title: 'Блок с рамочкой',
  icon: `<svg id="_x31_"viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g>
    <path d="m21.5 22h-19c-1.378 0-2.5-1.121-2.5-2.5v-15c0-1.379 1.122-2.5 2.5-2.5h19c1.378
    0 2.5 1.121 2.5 2.5v15c0 1.379-1.122 2.5-2.5 2.5zm-19-19c-.827 0-1.5.673-1.5 1.5v15c0
    .827.673 1.5 1.5 1.5h19c.827 0 1.5-.673 1.5-1.5v-15c0-.827-.673-1.5-1.5-1.5z"
    fill="currentColor"/></g><g>
    <path d="m3.5 10c-.276 0-.5-.224-.5-.5v-2c0-1.379 1.122-2.5 2.5-2.5h2c.276 0
    .5.224.5.5s-.224.5-.5.5h-2c-.827 0-1.5.673-1.5 1.5v2c0 .276-.224.5-.5.5z"
    fill="currentColor"/></g><g>
    <path d="m18.5 19h-2c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h2c.827 0 1.5-.673
    1.5-1.5v-2c0-.276.224-.5.5-.5s.5.224.5.5v2c0 1.379-1.122 2.5-2.5 2.5z"
    fill="currentColor"/></g></svg>`,
  shortcut: 'Ctrl + Alt + 5',
  command: 'convert-to-aside',
  marks: [
    {
      tag: 'ASIDE',
      attributes: ['class="aside aside-gray"'],
    },
  ],
};

export const asidePlugin = (opts?: Partial<DefaultPluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, tag, attributes, title, icon, shortcut, command, marks,
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
    textarena.addMiddleArenas(arena);
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
