import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaWithText from '../interfaces/ArenaWithText';
import ArenaNode from '../interfaces/ArenaNode';

type MarkOptions = {
  tag: string,
  attributes: string[];
};

type ParagraphOptions = {
  name: string,
  tag: string,
  attributes: string[],
  marks: MarkOptions[],
};

const defaultOptions: ParagraphOptions = {
  name: 'paragraph',
  tag: 'P',
  attributes: [],
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

const paragraphPlugin = (opts?: ParagraphOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, tag, attributes, marks,
    } = { ...defaultOptions, ...(opts || {}) };
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        allowText: true,
        allowFormating: true,
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaWithText;
    textarena.setDefaultTextArena(arena as ArenaWithText);
    textarena.registerCommand(
      'convert-to-paragraph',
      (ta: Textarena, selection: ArenaSelection) => ta.transformModel(selection, arena),
    );
    textarena.registerShortcut(
      'Alt + Digit0',
      'convert-to-paragraph',
    );
    textarena.registerTool({
      name: 'paragraph',
      title: 'Paragraph',
      icon: '<b>¶</b>',
      shortcut: 'Alt + Digit0',
      hint: '0',
      command: 'convert-to-paragraph',
      checkStatus: (node: ArenaNode):
        boolean => node.arena === arena,
    });
  },
});

export default paragraphPlugin;
