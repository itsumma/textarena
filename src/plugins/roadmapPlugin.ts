import Textarena from '../Textarena';
import ArenaPlugin, { DefaultPluginOptions } from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaMediatorInterface, ArenaTextInterface } from '../interfaces/Arena';
import { AnyArenaNode } from '../interfaces/ArenaNode';

const defaultOptions: DefaultPluginOptions = {
  name: 'roadmap',
  tag: 'ROADMAP',
  attributes: { },
  title: 'Roadmap',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.94 13.69" fill="currentColor"><path d="M3.47,4.88a2,2,0,1,0,2,2A2,2,0,0,0,3.47,4.88Z" style="fill:none"/><path d="M6.94,6.85A3.48,3.48,0,0,0,4.22,3.46h0V.75a.75.75,0,1,0-1.5,0v2.7h0a3.47,3.47,0,0,0,0,6.77h0v2.7a.75.75,0,1,0,1.5,0v-2.7h0A3.47,3.47,0,0,0,6.94,6.85Zm-3.47,2a2,2,0,1,1,2-2A2,2,0,0,1,3.47,8.82Z"/></svg>',
  shortcut: 'Ctrl + Alt + 7',
  command: 'convert-to-roadmap',
  marks: [
    {
      tag: 'ROADMAP',
      attributes: [],
    },
  ],
};

const roadmapPlugin = (opts?: Partial<DefaultPluginOptions>): ArenaPlugin => ({
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
              boolean => node.arena === arena,
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

export default roadmapPlugin;
