import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaSingleInterface } from '../interfaces/Arena';
import { ArenaNodeText } from '../interfaces/ArenaNode';

const defaultOptions = {
  name: 'hr',
  icon: `<svg viewBox="0 8 18 2" width="18" height="2">
    <path d="M 4 13 L 20 13 C 20.55 13 21 12.55 21 12 C 21 11.45 20.55 11 20 11 L 4 11 C 3.45 11 3 11.45 3 12 C 3 12.55 3.45 13 4 13 Z" id="🔹-Icon-Color" fill="currentColor" transform="matrix(1, 0, 0, 1, -3, -3)"></path>
  </svg>`,
  title: 'Horizontal rule',
  tag: 'HR',
  attributes: [],
  shortcut: 'Alt + KeyH',
  hint: 'h',
  command: 'add-hr',
};

const hrPlugin = (opts?: typeof defaultOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, shortcut, hint, command,
    } = { ...defaultOptions, ...(opts || {}) };
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        single: true,
      },
      [
        {
          tag: 'HR',
          attributes: [],
        },
      ],
      [textarena.getRootArenaName()],
    ) as ArenaSingleInterface;
    textarena.registerCommand(
      command,
      (ta: Textarena, selection: ArenaSelection) =>
        ta.insertBeforeSelected(selection, arena),
    );

    textarena.registerShortcut(
      shortcut,
      command,
    );
    textarena.registerCreator({
      name,
      icon,
      title,
      shortcut,
      hint,
      command,
      canShow: (node: ArenaNodeText) =>
        node.parent.isAllowedNode(arena),
    });
    textarena.addSimpleArenas(arena);
  },
});

export default hrPlugin;
