import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaMediatorInterface, ArenaTextInterface } from '../interfaces/Arena';
import { ArenaNodeText, ChildArenaNode } from '../interfaces/ArenaNode';

type MarkOptions = {
  tag: string,
  attributes: string[];
};

type Options = {
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

const defaultOptions: Options = {
  name: 'aside',
  tag: 'ASIDE',
  attributes: [],
  title: 'Aside',
  icon: `<svg id="_x31_"viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g>
<path d="m21.5 22h-19c-1.378 0-2.5-1.121-2.5-2.5v-15c0-1.379 1.122-2.5 2.5-2.5h19c1.378 0 2.5 1.121 2.5 2.5v15c0 1.379-1.122 2.5-2.5 2.5zm-19-19c-.827 0-1.5.673-1.5 1.5v15c0 .827.673 1.5 1.5 1.5h19c.827 0 1.5-.673 1.5-1.5v-15c0-.827-.673-1.5-1.5-1.5z" fill="currentColor"/></g><g>
<path d="m3.5 10c-.276 0-.5-.224-.5-.5v-2c0-1.379 1.122-2.5 2.5-2.5h2c.276 0 .5.224.5.5s-.224.5-.5.5h-2c-.827 0-1.5.673-1.5 1.5v2c0 .276-.224.5-.5.5z" fill="currentColor"/></g><g>
<path d="m18.5 19h-2c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h2c.827 0 1.5-.673 1.5-1.5v-2c0-.276.224-.5.5-.5s.5.224.5.5v2c0 1.379-1.122 2.5-2.5 2.5z" fill="currentColor"/></g></svg>`,
  shortcut: 'Alt + KeyA',
  hint: 'a',
  command: 'convert-to-aside',
  marks: [
    {
      tag: 'ASIDE',
      attributes: [],
    },
  ],
};

const asidePlugin = (opts?: Options): ArenaPlugin => ({
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
        group: true,
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
    textarena.registerCreator({
      name,
      title,
      icon,
      shortcut,
      hint,
      command,
      canShow: (node: ArenaNodeText) =>
        node.parent.isAllowedNode(arena),
    });
  },
});

export default asidePlugin;
