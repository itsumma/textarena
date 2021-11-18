import ArenaSelection from '../../helpers/ArenaSelection';
import { ArenaMediatorInterface, ArenaTextInterface } from '../../interfaces/Arena';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import ArenaPlugin, { DefaultPluginOptions } from '../../interfaces/ArenaPlugin';
import Textarena from '../../Textarena';
import ArenaTwoColumns from './ArenaTwoColumns';
import twoColumnsOutput from './twoColumnsOutput';

const defaultOptions: DefaultPluginOptions = {
  name: 'two-columns',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.06 13.69" fill="currentColor"><g ><g ><path d="M5.68,13.69h-5A.71.71,0,0,1,0,13V.71A.71.71,0,0,1,.71,0h5a.71.71,0,0,1,.71.71V13A.71.71,0,0,1,5.68,13.69ZM1.42,12.28H5V1.42H1.42Z"/><path d="M13.35,13.69h-5A.71.71,0,0,1,7.67,13V.71A.71.71,0,0,1,8.38,0h5a.71.71,0,0,1,.71.71V13A.71.71,0,0,1,13.35,13.69ZM9.09,12.28h3.55V1.42H9.09Z"/></g></g></svg>',
  title: 'Две колонки',
  tag: 'ARENA-TWO-COLUMNS',
  attributes: {},
  command: 'add-two-columns',
  shortcut: 'Ctrl + Alt + 6',
  component: 'arena-two-columns',
  componentConstructor: ArenaTwoColumns,
  marks: [
    {
      tag: 'ARENA-TWO-COLUMNS',
      attributes: [],
    },
    {
      tag: 'DIV',
      attributes: ['class="arena-two-col"'],
    },
  ],
  output: twoColumnsOutput,
};

const twoColumnsPlugin = (opts?: Partial<DefaultPluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, shortcut, command,
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
    const middleArenas = textarena.getMiddleArenas();
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
        {
          tag: 'DIV',
          attributes: ['class="arena-col"'],
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
      [textarena.getRootArenaName(), ...middleArenas.map((a) => a.name)],
    ) as ArenaMediatorInterface;

    if (command) {
      textarena.registerCommand(command, (ta: Textarena, selection: ArenaSelection) => {
        const [sel] = ta.insertBeforeSelected(selection, arena);
        return sel;
      });
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
              boolean => node.arena === arena,
          });
        }
        textarena.registerCreator({
          name,
          icon,
          title,
          shortcut,
          command,
          canShow: (node: AnyArenaNode) =>
            textarena.isAllowedNode(node, arena),
        });
      }
    }
  },
});

export default twoColumnsPlugin;
