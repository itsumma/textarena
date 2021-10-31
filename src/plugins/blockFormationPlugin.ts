import { ArenaSelection } from '../helpers';
import {
  AnyArenaNode, ArenaPlugin, ArenaTextInterface, DefaultPluginOptions,
} from '../interfaces';
import Textarena from '../Textarena';
import utils from '../utils';

const defaultOptions: DefaultPluginOptions = {
  name: 'block-formation',
  tag: 'DIV',
  attributes: { class: 'block-formation' },
  allowedAttributes: [],
  title: 'Block Formation',
  icon: '<b>A</b>',
  command: 'convert-to-block-formation',
  shortcut: 'Ctrl + Alt + 9',
  description: 'Block Formation',
  marks: [
    {
      tag: 'DIV',
      attributes: ['class="block-formation"'],
    },
  ],
};

export const blockFormationPlugin = (opts?: DefaultPluginOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const {
      name, title, tag, attributes, icon, shortcut, command, marks, description,
      allowedAttributes,
    } = { ...defaultOptions, ...(opts || {}) };
    if (name && tag && attributes) {
      const arena = textarena.registerArena(
        {
          name,
          tag,
          attributes,
          allowedAttributes,
          hasText: true,
          nextArena: paragraph,
        },
        marks,
        [textarena.getRootArenaName()],
      ) as ArenaTextInterface;
      textarena.addSimpleArenas(arena);
      if (command) {
        textarena.registerCommand(
          command,
          (ta: Textarena, selection: ArenaSelection) => {
            let isApplied = true;
            utils.modelTree.runThroughSelection(
              selection,
              (node: AnyArenaNode) => {
                isApplied = isApplied && node.arena === arena;
              },
            );
            const newSelection = ta.applyArenaToSelection(
              selection,
              isApplied ? paragraph : arena,
            );
            utils.modelTree.runThroughSelection(
              newSelection,
              (n: AnyArenaNode) => {
                if (n.hasText && n.arena.name.substr(0, n.arena.name.length - 1) === 'header') {
                  let slug = n.getAttribute('id');
                  if (!slug && n.arena.allowedAttributes.includes('id')) {
                    const text = n.getRawText();
                    slug = utils.str.prepareForAttribute(text.toLowerCase().trim());
                    n.setAttribute('id', slug);
                  }
                }
              },
            );
            return newSelection;
          },
        );
        if (shortcut) {
          textarena.registerShortcut(
            shortcut,
            command,
            description,
          );
        }
        if (title && icon) {
          textarena.registerTool({
            name,
            title,
            icon,
            shortcut,
            command,
            checkStatus: (node: AnyArenaNode): boolean =>
              node.arena === arena,
          });
        }
        if (title) {
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
    }
  },
});
