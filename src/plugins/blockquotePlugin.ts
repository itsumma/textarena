import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaMediatorInterface, ArenaTextInterface } from '../interfaces/Arena';
import { ChildArenaNode } from '../interfaces/ArenaNode';

type MarkOptions = {
  tag: string,
  attributes: string[];
};

type BlockquoteOptions = {
  name: string,
  tag: string,
  attributes: string[],
  title: string,
  icon: string,
  shortcut: string,
  hint: string,
  command: string,
  marks: MarkOptions[],
};

const defaultOptions: BlockquoteOptions = {
  name: 'blockquote',
  tag: 'BLOCKQUOTE',
  attributes: [],
  title: 'Blockquote',
  icon: '„“',
  shortcut: 'Alt + Quote',
  hint: '"',
  command: 'convert-to-blockquote',
  marks: [
    {
      tag: 'BLOCKQUOTE',
      attributes: [],
    },
  ],
};

const blockquotePlugin = (opts?: BlockquoteOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, tag, attributes, title, icon, shortcut, hint, command, marks,
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
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaMediatorInterface;
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
      hint,
      command,
      checkStatus: (node: ChildArenaNode):
        boolean => node.arena === arena,
    });
  },
});

export default blockquotePlugin;
