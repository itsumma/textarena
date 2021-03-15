import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';
import ArenaSelection from 'ArenaSelection';
import ArenaWithText from 'interfaces/ArenaWithText';
import ArenaNode from 'interfaces/ArenaNode';

const posibleTags = ['h1', 'h2', 'h3', 'h4'];

const defaultOptions = {
  tags: ['h2', 'h3', 'h4'],
};

const headersPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: any): void {
    const options = { ...defaultOptions, ...(opts || {}) };
    options.tags.forEach((type: string) => {
      if (posibleTags.includes(type)) {
        const number = parseInt(type[1], 10);
        const paragraph = textarena.model.getArena('paragraph');
        if (!paragraph) {
          throw new Error('Arena "paragraph" not found');
        }
        const arena = textarena.model.registerArena(
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
          [ArenaModel.rootArenaName],
        );
        textarena.commandManager.registerCommand(
          `convert-to-header${number}`,
          (ta: Textarena, selection: ArenaSelection) => ta.model.transformModel(selection, arena),
        );
        textarena.commandManager.registerShortcut(
          `Alt + Digit${number}`,
          `convert-to-header${number}`,
        );
        textarena.toolbar.registerTool({
          name: `header${number}`,
          title: `Header ${number}`,
          icon: `<b>H${number}</b>`,
          shortcut: `Alt + Digit${number}`,
          hint: number.toString(),
          command: `convert-to-header${number}`,
          checkStatus: (node: ArenaNode):
            boolean => node.arena === arena,
        });
        textarena.creatorBar.registerCreator({
          name: `header${number}`,
          title: `Header ${number}`,
          icon: `<b>H${number}</b>`,
          shortcut: `Alt + Digit${number}`,
          hint: number.toString(),
          command: `convert-to-header${number}`,
        });
      }
    });
  },
};

export default headersPlugin;
