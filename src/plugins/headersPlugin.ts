import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaWithText from '../interfaces/ArenaWithText';
import ArenaNode from '../interfaces/ArenaNode';
import ArenaNodeText from '../interfaces/ArenaNodeText';

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
        const paragraph = textarena.getDefaultTextArena();
        if (!paragraph) {
          throw new Error('Default Arena for text not found');
        }
        const arena = textarena.registerArena(
          {
            name: `header${number}`,
            tag: `H${number}`,
            attributes: [],
            allowText: true,
            allowFormating: false,
            nextArena: paragraph as ArenaWithText,
          },
          [
            {
              tag: `H${number}`,
              attributes: [],
            },
          ],
          [textarena.getRootArenaName()],
        );
        textarena.registerCommand(
          `convert-to-header${number}`,
          (ta: Textarena, selection: ArenaSelection) =>
            ta.transformModel(selection, arena as ArenaWithText),
        );
        textarena.registerShortcut(
          `Alt + Digit${number}`,
          `convert-to-header${number}`,
        );
        textarena.registerTool({
          name: `header${number}`,
          title: `Header ${number}`,
          icon: `<b>H${number}</b>`,
          shortcut: `Alt + Digit${number}`,
          hint: number.toString(),
          command: `convert-to-header${number}`,
          checkStatus: (node: ArenaNode):
            boolean => node.arena === arena,
        });
        textarena.registerCreator({
          name: `header${number}`,
          title: `Header ${number}`,
          icon: `<b>H${number}</b>`,
          shortcut: `Alt + Digit${number}`,
          hint: number.toString(),
          command: `convert-to-header${number}`,
          canShow: (node: ArenaNodeText) => node.parent.arena.allowedArenas.includes(arena),
        });
      }
    });
  },
});

export default headersPlugin;
