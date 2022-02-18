import { ArenaSelection } from '../helpers';
import {
  AnyArenaNode, ArenaMediatorInterface, ArenaPlugin, ArenaTextInterface, DefaultPluginOptions,
} from '../interfaces';
import Textarena from '../Textarena';
import utils from '../utils';

const defaultOptions: DefaultPluginOptions = {
  name: 'blockquote',
  tag: 'BLOCKQUOTE',
  attributes: { class: 'textarena-blockquote' },
  title: 'Blockquote',
  icon: `<svg width="16px" height="10px" viewBox="0 0 16 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="Rounded" transform="translate(-444.000000, -2109.000000)">
          <g id="Editor" transform="translate(100.000000, 1960.000000)">
              <g id="-Round-/-Editor-/-format_quote" transform="translate(340.000000, 142.000000)">
                  <g>
                      <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                      <path d="M7.17,17 C7.68,17 8.15,16.71 8.37,16.26 L9.79,13.42 C9.93,13.14 10,12.84 10,12.53 L10,8 C10,7.45 9.55,7 9,7 L5,7 C4.45,7 4,7.45 4,8 L4,12 C4,12.55 4.45,13 5,13 L7,13 L5.97,15.06 C5.52,15.95 6.17,17 7.17,17 Z M17.17,17 C17.68,17 18.15,16.71 18.37,16.26 L19.79,13.42 C19.93,13.14 20,12.84 20,12.53 L20,8 C20,7.45 19.55,7 19,7 L15,7 C14.45,7 14,7.45 14,8 L14,12 C14,12.55 14.45,13 15,13 L17,13 L15.97,15.06 C15.52,15.95 16.17,17 17.17,17 Z" id="🔹-Icon-Color" fill="currentColor"></path>
                  </g>
              </g>
          </g>
      </g>
  </g>
</svg>`,
  shortcut: 'Ctrl + Alt + "',
  command: 'convert-to-blockquote',
  marks: [
    {
      tag: 'BLOCKQUOTE',
      attributes: [],
    },
  ],
};

export const blockquotePlugin = (opts?: Partial<DefaultPluginOptions>): ArenaPlugin => ({
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
