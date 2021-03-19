import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaNodeText from '../interfaces/ArenaNodeText';

const defaultOptions = {
  name: 'hr',
  icon: '<b>–</b>',
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
    );
    textarena.registerCommand(
      command,
      (ta: Textarena, selection: ArenaSelection) => ta.transformModel(selection, arena),
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
      canShow: (node: ArenaNodeText) => node.parent.arena.allowedArenas.includes(arena),
    });
    textarena.addSimpleArenas(arena);
  },
});

export default hrPlugin;
