import Textarena from '../Textarena';
import ArenaPlugin, { DefaultPluginOptions } from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaSingleInterface } from '../interfaces/Arena';
import { AnyArenaNode } from '../interfaces/ArenaNode';

const defaultOptions: DefaultPluginOptions = {
  name: 'hr',
  icon: `<svg viewBox="0 8 18 2" width="18" height="2">
    <path d="M 4 13 L 20 13 C 20.55 13 21 12.55 21 12 C 21 11.45 20.55 11 20 11 L 4 11 C 3.45 11 3 11.45 3 12 C 3 12.55 3.45 13 4 13 Z" id="🔹-Icon-Color" fill="currentColor" transform="matrix(1, 0, 0, 1, -3, -3)"></path>
  </svg>`,
  title: 'Horizontal rule',
  tag: 'HR',
  attributes: {
    contenteditable: false,
  },
  shortcut: 'Ctrl + Alt + H',
  command: 'add-hr',
  marks: [
    {
      tag: 'HR',
      attributes: [],
    },
  ],
};

const hrPlugin = (opts?: Partial<DefaultPluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, shortcut, command, marks,
    } = { ...defaultOptions, ...(opts || {}) };
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        single: true,
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaSingleInterface;
    if (command) {
      textarena.registerCommand(
        command,
        (ta: Textarena, selection: ArenaSelection) => {
          const [sel] = ta.insertBeforeSelected(selection, arena);
          return sel;
        },
      );

      if (shortcut) {
        textarena.registerShortcut(
          shortcut,
          command,
        );
      }
      if (title) {
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
    textarena.addSimpleArenas(arena);
  },
});

export default hrPlugin;
