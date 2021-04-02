import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import { ArenaTextInterface } from '../interfaces/Arena';
import { ChildArenaNode } from '../interfaces/ArenaNode';
import ArenaSelection from '../helpers/ArenaSelection';

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
  attributes: ['class="paragraph"'],
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
        hasText: true,
      },
      marks,
    ) as ArenaTextInterface;
    textarena.setDefaultTextArena(arena as ArenaTextInterface);
    textarena.registerCommand(
      'convert-to-paragraph',
      (ta: Textarena, selection: ArenaSelection) =>
        ta.applyArenaToSelection(selection, arena),
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
      checkStatus: (node: ChildArenaNode):
        boolean => node.arena === arena,
    });
    textarena.addSimpleArenas(arena);
  },
});

export default paragraphPlugin;
