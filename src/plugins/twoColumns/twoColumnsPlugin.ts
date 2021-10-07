import ArenaSelection from '../../helpers/ArenaSelection';
import { ArenaMediatorInterface, ArenaTextInterface } from '../../interfaces/Arena';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import ArenaPlugin, { DefaulPluginOptions } from '../../interfaces/ArenaPlugin';
import Textarena from '../../Textarena';
import ArenaTwoColumns from './ArenaTwoColumns';
import twoColumnsOutput from './twoColumnsOutput';

const defaultOptions: DefaulPluginOptions = {
  name: 'two-columns',
  // icon: '<b>Q</b>',
  title: 'Две колонки',
  tag: 'ARENA-TWO-COLUMNS',
  attributes: {},
  command: 'add-two-columns',
  component: 'arena-two-columns',
  componentConstructor: ArenaTwoColumns,
  marks: [
    {
      tag: 'ARENA-TWO-COLUMNS',
      attributes: [],
    },
  ],
  output: twoColumnsOutput,
};

const twoColumnsPlugin = (opts?: Partial<DefaulPluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, shortcut, hint, command,
      component, componentConstructor, marks, output,
    } = {
      ...defaultOptions,
      ...(opts || {}),
    };
    if (component && componentConstructor && !customElements.get(component)) {
      customElements.define(component, componentConstructor);
    }
    const paragraph = textarena.getDefaultTextArena() as ArenaTextInterface;
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const allowedArenas = textarena.getSimpleArenas();
    const bodyContainer = textarena.registerArena(
      {
        name: `${name}-col`,
        tag: `${tag}-COL`,
        attributes: {},
        allowedArenas,
        arenaForText: paragraph as ArenaTextInterface,
      },
      [
        {
          tag: `${tag}-COL`,
          attributes: [],
        },
      ],
      [],
    ) as ArenaMediatorInterface;
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        protectedChildren: [
          bodyContainer,
          bodyContainer,
        ],
        arenaForText: bodyContainer,
        output,
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaMediatorInterface;

    if (command) {
      textarena.registerCommand(command, (ta: Textarena, selection: ArenaSelection) => {
        const sel = ta.insertBeforeSelected(selection, arena);
        return sel;
      });
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
            boolean => node.arena === arena,
        });
      }
      textarena.registerCreator({
        name,
        icon,
        title,
        shortcut,
        hint,
        command,
        canShow: (node: AnyArenaNode) =>
          textarena.isAllowedNode(node, arena),
      });
    }
  },
});

export default twoColumnsPlugin;
