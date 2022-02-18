import { ArenaSelection } from '../helpers';
import {
  AnyArenaNode, ArenaPlugin, ArenaTextInterface, DefaultPluginOptions,
} from '../interfaces';
import Textarena from '../Textarena';

const defaultOptions: DefaultPluginOptions = {
  name: 'paragraph',
  title: 'Paragraph',
  tag: 'P',
  attributes: { class: 'paragraph' },
  icon: '<b>¶</b>',
  shortcut: 'Ctrl + Alt + 0',
  description: 'Параграф',
  command: 'convert-to-paragraph',
  marks: [
    {
      tag: 'P',
      attributes: [],
    },
    {
      tag: 'DIV',
      attributes: [],
    },
  ],
};

export const paragraphPlugin = (opts?: Partial<DefaultPluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, title, tag, attributes, icon, shortcut, command, marks, description,
    } = { ...defaultOptions, ...(opts || {}) };
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        hasText: true,
      },
      marks,
    ) as ArenaTextInterface;
    textarena.setDefaultTextArena(arena as ArenaTextInterface);
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
          description,
        );
      }
      if (icon && title) {
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
    }
  },
});
