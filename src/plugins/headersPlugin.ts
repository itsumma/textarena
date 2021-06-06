import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import { ArenaTextInterface } from '../interfaces/Arena';
import { AnyArenaNode } from '../interfaces/ArenaNode';

const posibleTags = ['h1', 'h2', 'h3', 'h4'];

type ListTag = typeof posibleTags[number];

type ListsOptions = {
  tags: ListTag[],
};

const defaultOptions: ListsOptions = {
  tags: ['h2', 'h3', 'h4'],
};

const headersPlugin = (opts?: ListsOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const options = { ...defaultOptions, ...(opts || {}) };
    options.tags.forEach((type: string) => {
      if (posibleTags.includes(type)) {
        const number = parseInt(type[1], 10);
        const command = `convert-to-header${number}`;
        const name = `header${number}`;
        const tag = `H${number}`;
        const title = `Header ${number}`;
        const icon = `<b>H${number}</b>`;
        const shortcut = `Alt + Digit${number}`;
        const paragraph = textarena.getDefaultTextArena();
        if (!paragraph) {
          throw new Error('Default Arena for text not found');
        }
        const arena = textarena.registerArena(
          {
            name,
            tag,
            attributes: {},
            hasText: true,
            nextArena: paragraph,
          },
          [
            {
              tag,
              attributes: [],
            },
          ],
          [textarena.getRootArenaName()],
        ) as ArenaTextInterface;
        textarena.registerCommand(
          command,
          (ta: Textarena, selection: ArenaSelection) =>
            ta.applyArenaToSelection(selection, arena),
        );
        textarena.registerShortcut(
          shortcut,
          command,
        );
        textarena.registerTool({
          name,
          title,
          icon,
          shortcut,
          hint: number.toString(),
          command,
          checkStatus: (node: AnyArenaNode): boolean =>
            node.arena === arena,
        });
        textarena.registerCreator({
          name,
          title,
          icon,
          shortcut,
          hint: number.toString(),
          command,
          canShow: (node: AnyArenaNode) =>
            textarena.isAllowedNode(node, arena),
        });
      }
    });
  },
});

export default headersPlugin;
