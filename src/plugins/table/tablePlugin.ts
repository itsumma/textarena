import ArenaSelection from '../../helpers/ArenaSelection';
import { ArenaMediatorInterface, ArenaTextInterface } from '../../interfaces/Arena';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import ArenaPlugin, { DefaulPluginOptions } from '../../interfaces/ArenaPlugin';
import Textarena from '../../Textarena';
import ArenaTable from './ArenaTable';
import tableOutput from './tableOutput';

const defaultOptions: DefaulPluginOptions = {
  name: 'table',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.06 13.69" fill="currentColor"><g ><g ><path d="M5.68,13.69h-5A.71.71,0,0,1,0,13V.71A.71.71,0,0,1,.71,0h5a.71.71,0,0,1,.71.71V13A.71.71,0,0,1,5.68,13.69ZM1.42,12.28H5V1.42H1.42Z"/><path d="M13.35,13.69h-5A.71.71,0,0,1,7.67,13V.71A.71.71,0,0,1,8.38,0h5a.71.71,0,0,1,.71.71V13A.71.71,0,0,1,13.35,13.69ZM9.09,12.28h3.55V1.42H9.09Z"/></g></g></svg>',
  title: 'Таблица',
  tag: 'ARENA-TABLE',
  attributes: {},
  command: 'add-table',
  shortcut: 'Alt + Digit6',
  hint: '6',
  component: 'arena-table',
  componentConstructor: ArenaTable,
  marks: [
    {
      tag: 'ARENA-TABLE',
      attributes: [],
    },
    {
      tag: 'TABLE',
      attributes: [],
    },
  ],
  output: tableOutput,
};

const tablePlugin = (opts?: Partial<DefaulPluginOptions>): ArenaPlugin => ({
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
    const tdArena = textarena.registerArena(
      {
        name: `${name}-td`,
        tag: 'TD',
        attributes: {},
        allowedArenas,
        arenaForText: paragraph,
      },
      [
        {
          tag: 'TD',
          attributes: [],
        },
      ],
      [],
    ) as ArenaMediatorInterface;
    const trArena = textarena.registerArena(
      {
        name: `${name}-tr`,
        tag: 'TR',
        attributes: {},
        allowedArenas: [tdArena],
        arenaForText: tdArena,
        noPseudoCursor: true,
      },
      [
        {
          tag: 'TR',
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
        allowedArenas: [trArena],
        arenaForText: trArena,
        noPseudoCursor: true,
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

export default tablePlugin;
